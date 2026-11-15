/* GTAVI_VICE profile module
   Requires the existing window.gtaviSupabase client and the SQL objects
   already created in Supabase. Load after the existing membership script.
*/
(function(){
  "use strict";
  const client = window.gtaviSupabase;
  const host = document.querySelector("#membership .container");
  if(!client || !host) return;

  const BUCKET = "gta-user-avatars";
  const esc = value => String(value == null ? "" : value).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));
  const fmt = value => new Intl.NumberFormat("fa-IR").format(Number(value)||0);
  const fallbackAvatar = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="#21152f"/><circle cx="50" cy="37" r="18" fill="#a855f7"/><path d="M15 94c3-23 17-34 35-34s32 11 35 34" fill="#7c3aed"/></svg>'
  );
  let user = null;
  let profile = null;
  let busy = false;

  const app = document.createElement("section");
  app.id = "gtavi-profile-app";
  app.innerHTML = `
    <div class="gvp-panel">
      <div class="gvp-head">
        <img class="gvp-avatar" id="gvp-avatar-preview" src="${fallbackAvatar}" alt="تصویر پروفایل">
        <div style="flex:1;min-width:180px">
          <h3 class="gvp-title" id="gvp-display-name">پروفایل GTAVI_VICE</h3>
          <div class="gvp-muted" id="gvp-account-note">در حال بررسی حساب...</div>
        </div>
        <button type="button" class="gvp-btn secondary" id="gvp-edit-toggle">تکمیل / ویرایش پروفایل</button>
      </div>
      <div class="gvp-stats">
        <div class="gvp-stat"><strong id="gvp-points">۰</strong><span>امتیاز کل</span></div>
        <div class="gvp-stat"><strong id="gvp-rank">—</strong><span>رتبه</span></div>
        <div class="gvp-stat"><strong id="gvp-activity-count">۰</strong><span>مشارکت</span></div>
      </div>
      <div class="gvp-actions">
        <button type="button" class="gvp-btn" id="gvp-checkin">🎁 دریافت امتیاز حضور امروز</button>
        <button type="button" class="gvp-btn secondary" id="gvp-share-profile">پیوند پروفایل عمومی</button>
      </div>
      <div class="gvp-message" id="gvp-message" role="status" aria-live="polite">برای ساخت پروفایل، فرم را تکمیل کن.</div>
    </div>

    <form class="gvp-panel gvp-hidden" id="gvp-form">
      <h3 class="gvp-title">ساخت / ویرایش پروفایل</h3>
      <div class="gvp-form-grid">
        <div><label for="gvp-username">نام کاربری عمومی و یکتا *</label><input id="gvp-username" required minlength="3" maxlength="24" pattern="[A-Za-z0-9_آ-ی۰-۹]{3,24}" placeholder="مثلاً ViceFan_6"></div>
        <div><label for="gvp-nickname">لقب نمایشی</label><input id="gvp-nickname" maxlength="40" placeholder="لقب دلخواه"></div>
        <div><label for="gvp-avatar">تصویر پروفایل (حداکثر ۳ مگابایت)</label><input id="gvp-avatar" type="file" accept="image/png,image/jpeg,image/webp"></div>
        <div><label for="gvp-psn">PSN ID (اختیاری)</label><input id="gvp-psn" maxlength="40"></div>
        <div><label for="gvp-xbox">Xbox Gamertag (اختیاری)</label><input id="gvp-xbox" maxlength="40"></div>
        <div><label for="gvp-steam">Steam ID یا لینک پروفایل (اختیاری)</label><input id="gvp-steam" maxlength="180"></div>
      </div>
      <label>پلتفرم‌های مورد استفاده</label>
      <div class="gvp-platforms">
        <label><input type="checkbox" name="gvp-platform" value="PS5"> PS5</label>
        <label><input type="checkbox" name="gvp-platform" value="Xbox Series X"> Xbox Series X</label>
        <label><input type="checkbox" name="gvp-platform" value="Xbox Series S"> Xbox Series S</label>
      </div>
      <label for="gvp-primary">پلتفرم اصلی</label>
      <select id="gvp-primary"><option value="">ابتدا پلتفرم‌ها را انتخاب کن</option></select>
      <p class="gvp-muted">شناسه‌های بازی به‌صورت پیش‌فرض در پروفایل عمومی مخفی هستند. برای نمایش هرکدام، تیک مربوط را فعال کن.</p>
      <label class="gvp-check"><input id="gvp-show-psn" type="checkbox"> نمایش عمومی PSN ID</label>
      <label class="gvp-check"><input id="gvp-show-xbox" type="checkbox"> نمایش عمومی Xbox Gamertag</label>
      <label class="gvp-check"><input id="gvp-show-steam" type="checkbox"> نمایش عمومی Steam</label>
      <div class="gvp-actions"><button class="gvp-btn" type="submit" id="gvp-save">ذخیره پروفایل</button><button class="gvp-btn secondary" type="button" id="gvp-cancel">انصراف</button></div>
    </form>

    <div class="gvp-panel">
      <h3 class="gvp-title">🏆 برترین اعضای GTAVI_VICE</h3>
      <div class="gvp-list" id="gvp-leaderboard"><div class="gvp-muted">در حال دریافت رتبه‌بندی...</div></div>
    </div>
    <div class="gvp-panel">
      <h3 class="gvp-title">🕘 تاریخچه امتیازهای من</h3>
      <div class="gvp-list gvp-history" id="gvp-history"><div class="gvp-muted">در انتظار ورود به حساب...</div></div>
    </div>
    <div class="gvp-panel gvp-hidden" id="gvp-public-panel">
      <h3 class="gvp-title">پروفایل عمومی</h3>
      <div id="gvp-public-content"></div>
    </div>`;
  host.appendChild(app);

  const $ = id => document.getElementById(id);
  const msg = (text, type) => {
    $("gvp-message").textContent = text || "";
    $("gvp-message").className = "gvp-message" + (type ? " " + type : "");
  };
  const setBusy = value => {
    busy = value;
    ["gvp-save","gvp-checkin"].forEach(id => { const el=$(id); if(el) el.disabled=value; });
  };
  const avatarUrl = path => {
    if(!path) return fallbackAvatar;
    if(/^https?:\/\//i.test(path)) return path;
    return client.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  };
  function updatePrimaryOptions(selected){
    const values = [...app.querySelectorAll('input[name="gvp-platform"]:checked')].map(x=>x.value);
    $("gvp-primary").innerHTML = '<option value="">انتخاب پلتفرم اصلی</option>' +
      values.map(v=>'<option value="'+esc(v)+'">'+esc(v)+'</option>').join("");
    if(values.includes(selected)) $("gvp-primary").value=selected;
  }
  app.querySelectorAll('input[name="gvp-platform"]').forEach(el=>el.addEventListener("change",()=>updatePrimaryOptions($("gvp-primary").value)));

  async function loadProfile(){
    const result = await client.from("gta_user_profiles").select("*").eq("user_id",user.id).maybeSingle();
    if(result.error) throw result.error;
    profile = result.data || null;
    $("gvp-display-name").textContent = profile ? (profile.nickname || profile.username) : "پروفایل GTAVI_VICE";
    $("gvp-username").value = profile?.username || "";
    $("gvp-nickname").value = profile?.nickname || "";
    $("gvp-psn").value = profile?.psn_id || "";
    $("gvp-xbox").value = profile?.xbox_gamertag || "";
    $("gvp-steam").value = profile?.steam_profile || "";
    $("gvp-show-psn").checked = !!profile?.show_psn_id;
    $("gvp-show-xbox").checked = !!profile?.show_xbox_gamertag;
    $("gvp-show-steam").checked = !!profile?.show_steam_profile;
    app.querySelectorAll('input[name="gvp-platform"]').forEach(el=>el.checked=(profile?.platforms||[]).includes(el.value));
    updatePrimaryOptions(profile?.primary_platform || "");
    $("gvp-avatar-preview").src=avatarUrl(profile?.avatar_path);
    $("gvp-account-note").textContent = user.is_anonymous
      ? "حساب مهمان فعال است؛ می‌توانی پروفایل را بسازی و بعداً همین حساب را دائمی کنی."
      : "حساب دائمی فعال است: " + (user.email || "");
    $("gvp-edit-toggle").textContent = profile ? "ویرایش پروفایل" : "ساخت پروفایل";
    $("gvp-form").classList.toggle("gvp-hidden",!!profile);
    await Promise.all([loadMyStats(),loadHistory(),loadLeaderboard()]);
  }
  async function loadMyStats(){
    const result = await client.rpc("get_gta_my_stats");
    if(result.error) throw result.error;
    const row = Array.isArray(result.data) ? result.data[0] : result.data;
    $("gvp-points").textContent=fmt(row?.total_points || 0);
    $("gvp-rank").textContent=Number(row?.user_rank || 0) ? fmt(row.user_rank) : "—";
    $("gvp-activity-count").textContent=fmt(row?.participation_count || 0);
  }
  async function loadHistory(){
    const result=await client.from("gta_user_points_ledger").select("activity_type,points,created_at,details").eq("user_id",user.id).order("created_at",{ascending:false}).limit(12);
    if(result.error) throw result.error;
    const rows=result.data||[];
    $("gvp-history").innerHTML=rows.length?rows.map(row=>{
      const label=row.details?.description || ({
        poll_vote:"شرکت در نظرسنجی",daily_checkin:"حضور روزانه",weekly_streak_bonus:"جایزه ۷ روز متوالی"
      }[row.activity_type] || row.activity_type);
      const date=new Intl.DateTimeFormat("fa-IR",{dateStyle:"medium",timeStyle:"short"}).format(new Date(row.created_at));
      return '<div class="gvp-row"><span>'+esc(label)+'<small>'+esc(date)+'</small></span><strong style="direction:ltr;color:'+(row.points>=0?'#8be2bd':'#ff9baf')+'">'+(row.points>0?'+':'')+fmt(row.points)+'</strong></div>';
    }).join(""):'<div class="gvp-muted">هنوز فعالیت امتیازی ثبت نشده است.</div>';
  }
  async function loadLeaderboard(){
    const result=await client.rpc("get_gta_leaderboard",{p_limit:10});
    if(result.error) throw result.error;
    const rows=result.data||[];
    $("gvp-leaderboard").innerHTML=rows.length?rows.map(row=>
      '<div class="gvp-row"><div class="gvp-row-main"><strong>#'+fmt(row.user_rank)+'</strong><div><b>'+esc(row.nickname||row.username)+'</b><small>@'+esc(row.username)+'</small></div></div><strong>'+fmt(row.total_points)+' امتیاز</strong></div>'
    ).join(""):'<div class="gvp-muted">هنوز رتبه‌بندی شکل نگرفته است.</div>';
  }

  async function saveProfile(event){
    event.preventDefault();
    if(busy || !user) return;
    const username=$("gvp-username").value.trim();
    const platforms=[...app.querySelectorAll('input[name="gvp-platform"]:checked')].map(x=>x.value);
    const primary=$("gvp-primary").value || null;
    if(!/^[A-Za-z0-9_آ-ی۰-۹]{3,24}$/.test(username)){msg("نام کاربری باید ۳ تا ۲۴ نویسه و بدون فاصله باشد.","error");return;}
    if(platforms.length && !primary){msg("پلتفرم اصلی را انتخاب کن.","error");return;}
    if(primary && !platforms.includes(primary)){msg("پلتفرم اصلی باید جزو پلتفرم‌های انتخاب‌شده باشد.","error");return;}
    setBusy(true);
    try{
      let avatar_path=profile?.avatar_path || null;
      const file=$("gvp-avatar").files[0];
      if(file){
        if(file.size>3*1024*1024) throw new Error("حجم تصویر باید کمتر از ۳ مگابایت باشد.");
        if(!["image/jpeg","image/png","image/webp"].includes(file.type)) throw new Error("فقط تصویر JPG، PNG یا WEBP مجاز است.");
        const ext=file.type==="image/png"?"png":file.type==="image/webp"?"webp":"jpg";
        const path=user.id+"/"+Date.now()+"."+ext;
        const upload=await client.storage.from(BUCKET).upload(path,file,{upsert:true,contentType:file.type});
        if(upload.error) throw upload.error;
        avatar_path=path;
      }
      const payload={
        user_id:user.id,username:username,nickname:$("gvp-nickname").value.trim()||null,
        avatar_path:avatar_path,psn_id:$("gvp-psn").value.trim()||null,
        xbox_gamertag:$("gvp-xbox").value.trim()||null,steam_profile:$("gvp-steam").value.trim()||null,
        platforms:platforms,primary_platform:primary,
        show_psn_id:$("gvp-show-psn").checked,show_xbox_gamertag:$("gvp-show-xbox").checked,
        show_steam_profile:$("gvp-show-steam").checked,updated_at:new Date().toISOString()
      };
      const saved=await client.from("gta_user_profiles").upsert(payload,{onConflict:"user_id"}).select().single();
      if(saved.error) throw saved.error;
      profile=saved.data;
      $("gvp-form").classList.add("gvp-hidden");
      $("gvp-avatar").value="";
      msg("پروفایل با موفقیت ذخیره شد 💜","success");
      await loadProfile();
    }catch(error){
      const message=String(error?.message||error);
      msg(/duplicate key|unique/i.test(message)?"این نام کاربری قبلاً انتخاب شده است. نام دیگری امتحان کن.":message,"error");
    }finally{setBusy(false);}
  }

  async function checkin(){
    if(busy) return;
    setBusy(true);
    try{
      const result=await client.rpc("claim_daily_checkin");
      if(result.error) throw result.error;
      const data=result.data||{};
      if(!data.success){msg(data.message||"امروز قبلاً حضور ثبت کرده‌ای.","");return;}
      msg("حضور امروز ثبت شد! "+fmt(data.daily_points)+" امتیاز روزانه"+(data.bonus_points?" + "+fmt(data.bonus_points)+" امتیاز جایزه هفتگی":"")+" | زنجیره: "+fmt(data.streak_days)+" روز 💜","success");
      await Promise.all([loadMyStats(),loadHistory(),loadLeaderboard()]);
    }catch(error){msg(error.message||"ثبت حضور ناموفق بود.","error");}
    finally{setBusy(false);}
  }
  async function shareProfile(){
    if(!profile){msg("ابتدا پروفایل خود را ذخیره کن.","error");return;}
    const url=location.origin+location.pathname+"#profile="+encodeURIComponent(profile.username);
    try{await navigator.clipboard.writeText(url);msg("پیوند پروفایل عمومی کپی شد.","success");}
    catch(e){window.prompt("پیوند پروفایل را کپی کن:",url);}
  }
  async function loadPublicProfile(username){
    const panel=$("gvp-public-panel"),content=$("gvp-public-content");
    panel.classList.remove("gvp-hidden");
    content.textContent="در حال دریافت پروفایل...";
    try{
      const result=await client.rpc("get_gta_public_profile",{p_username:username});
      if(result.error) throw result.error;
      const row=Array.isArray(result.data)?result.data[0]:result.data;
      if(!row){content.textContent="این پروفایل پیدا نشد.";return;}
      content.innerHTML='<div class="gvp-head"><img class="gvp-avatar" src="'+esc(avatarUrl(row.avatar_path))+'" alt=""><div><h4 class="gvp-title">'+esc(row.nickname||row.username)+'</h4><div class="gvp-muted">@'+esc(row.username)+'</div></div></div>'+
        '<div class="gvp-stats"><div class="gvp-stat"><strong>'+fmt(row.total_points)+'</strong><span>امتیاز</span></div><div class="gvp-stat"><strong>'+fmt(row.user_rank)+'</strong><span>رتبه</span></div><div class="gvp-stat"><strong>'+fmt(row.participation_count)+'</strong><span>مشارکت</span></div></div>'+
        '<p class="gvp-muted">پلتفرم‌ها: '+esc((row.platforms||[]).join("، ")||"ثبت نشده")+'</p>'+
        '<p class="gvp-muted">پلتفرم اصلی: '+esc(row.primary_platform||"ثبت نشده")+'</p>'+
        '<p class="gvp-muted">'+(row.psn_id?'PSN: '+esc(row.psn_id)+' · ':'')+(row.xbox_gamertag?'Xbox: '+esc(row.xbox_gamertag)+' · ':'')+(row.steam_profile?'Steam: '+esc(row.steam_profile):'')+'</p>';
    }catch(error){content.textContent="دریافت پروفایل با خطا مواجه شد: "+(error.message||error);}
  }

  $("gvp-edit-toggle").addEventListener("click",()=>{$("gvp-form").classList.toggle("gvp-hidden");});
  $("gvp-cancel").addEventListener("click",()=>{$("gvp-form").classList.add("gvp-hidden");});
  $("gvp-form").addEventListener("submit",saveProfile);
  $("gvp-checkin").addEventListener("click",checkin);
  $("gvp-share-profile").addEventListener("click",shareProfile);

  async function initialize(){
    const session=await client.auth.getSession();
    if(session.error) throw session.error;
    user=session.data.session?.user||null;
    if(!user){
      $("gvp-account-note").textContent="برای استفاده از پروفایل، ابتدا وارد / عضو شو.";
      $("gvp-checkin").disabled=true;
      $("gvp-edit-toggle").disabled=true;
      $("gvp-history").textContent="برای مشاهده تاریخچه وارد حساب شو.";
      $("gvp-leaderboard").textContent="برای مشاهده رتبه‌بندی، پروفایل‌های عمومی در حال آماده‌سازی‌اند.";
      return;
    }
    await loadProfile();
    const hash=location.hash.match(/^#profile=(.+)$/);
    if(hash) await loadPublicProfile(decodeURIComponent(hash[1]));
  }
  client.auth.onAuthStateChange((_event,session)=>{
    user=session?.user||null;
    if(user) setTimeout(()=>initialize().catch(e=>msg(e.message||String(e),"error")),0);
  });
  initialize().catch(error=>msg("بارگذاری پروفایل ناموفق بود: "+(error.message||error),"error"));
})();
