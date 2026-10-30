
const news = [
  {
    id: 1,
    title: "شمارش معکوس GTA VI؛ تاریخ انتشار مشخص است",
    date: "2026-10-27",
    category: "تاریخ انتشار",
    image: "./news-release.png",
    summary: "برای سفر به لئونیدا آماده شو؛ تاریخ اعلام‌شدهٔ انتشار GTA VI نزدیک است.",
    content: "طبق اطلاعات رسمی Rockstar Games، بازی Grand Theft Auto VI برای انتشار در ۱۹ نوامبر ۲۰۲۶ برنامه‌ریزی شده است. تا زمان انتشار، اخبار و اطلاعیه‌های رسمی را دنبال کن؛ هرگونه تغییر احتمالی در برنامهٔ عرضه باید بر اساس اعلام رسمی بررسی شود.",
    source: "https://www.rockstargames.com/VI"
  },
  {
    id: 2,
    title: "لوسیا و جیسون؛ زوج اصلی داستان GTA VI",
    date: "2026-10-27",
    category: "شخصیت‌ها",
    image: "./lucia-jason.png",
    summary: "با دو شخصیت اصلی بازی و ماجرای آن‌ها در دنیای جنایی لئونیدا آشنا شو.",
    content: "لوسیا کامینوس و جیسون دووال دو شخصیت اصلی معرفی‌شده برای GTA VI هستند. داستان بازی در ایالت خیالی لئونیدا جریان دارد و وایس‌سیتی یکی از بخش‌های مهم این جهان است. برای جزئیات داستانی بیشتر، باید به اطلاعات و تریلرهای رسمی Rockstar Games تکیه کرد.",
    source: "https://www.rockstargames.com/VI"
  },
  {
    id: 3,
    title: "وایس‌سیتی و لئونیدا؛ دنیای تازه GTA VI",
    date: "2026-10-27",
    category: "دنیای بازی",
    image: "./vice-city-world.png",
    summary: "از فضای شهری وایس‌سیتی تا محیط‌های متنوع لئونیدا؛ نگاهی به جهان بازی.",
    content: "GTA VI بازیکنان را به ایالت خیالی لئونیدا می‌برد؛ جهانی با وایس‌سیتی و محیط‌های گوناگون. تریلرها و تصاویر رسمی، بخش‌هایی از فضای شهری، سواحل و زندگی این منطقه را نشان داده‌اند. جزئیات تأییدنشده دربارهٔ اندازهٔ نقشه یا امکانات بازی را نباید قطعی دانست.",
    source: "https://www.rockstargames.com/VI"
  },
  {
    id: 4,
    title: "موسیقی متن اختصاصی GTA VI را گروه Justice می‌سازد",
    date: "2026-10-29",
    category: "اطلاعیه",
    image: "./news-justice.png",
    summary: "Rockstar از آلبوم موسیقی متن اختصاصی بازی با آهنگ‌سازی گروه فرانسوی Justice رونمایی کرد.",
    content: "شرکت Rockstar Games اعلام کرد موسیقی متن اختصاصی Grand Theft Auto VI توسط گروه فرانسوی Justice ساخته شده است. این موسیقی به‌صورت پویا با اتفاقات و شیوه تعامل بازیکن با دنیای وایس‌سیتی و لئونیدا هماهنگ می‌شود. آلبوم رسمی موسیقی متن شامل ۳۰ قطعه است و برای انتشار در ۱۱ دسامبر ۲۰۲۶ برنامه‌ریزی شده است. قطعه جدید Pusher با همکاری Gesaffelstein نیز هم‌زمان معرفی شد.",
    source: "https://www.rockstargames.com/newswire/article/39ak8a12395591/grand-theft-auto-vi-original-score-by-justice"
  },
  {
    id: 5,
    title: "تصاویر و جزئیات تازه GTA VI در مجله Edge منتشر شد",
    date: "2026-10-28",
    category: "دنیای بازی",
    image: "./news-edge.png",
    summary: "ویژه‌نامه ۱۶ صفحه‌ای Edge شامل مصاحبه با اعضای Rockstar و بیش از ۱۰ تصویر تازه از بازی است.",
    content: "ویژه‌نامه جدید مجله Edge با محوریت Grand Theft Auto VI منتشر شده است. این شماره شامل یک گزارش ۱۶ صفحه‌ای، مصاحبه با مدیران Rockstar Games و بیش از ۱۰ تصویر تازه از بازی است. تصاویر منتشرشده نگاه دیگری به جیسون، لوسیا و بخش‌هایی از محیط لئونیدا ارائه می‌کنند. این گزارش یکی از مطالب رسانه‌ای مهم GTA VI در روزهای نزدیک به انتشار بازی محسوب می‌شود.",
    source: "https://www.vice.com/en/article/gta-6-edge-magazine-new-screenshots-features/"
  },
  {
    id: 6,
    title: "تریلر نهایی GTA VI منتشر شد",
    date: "2026-10-15",
    category: "اطلاعیه",
    image: "./news-trailer.png",
    summary: "Rockstar تریلر انتشار GTA VI را منتشر کرد؛ همراه با موسیقی تازه‌ای از گروه Justice.",
    content: "شرکت Rockstar Games تریلر انتشار Grand Theft Auto VI را در تاریخ ۱۵ اکتبر ۲۰۲۶ منتشر کرد. در این تریلر قطعه Flower in a Hurricane با همکاری Justice، Tame Impala، SZA و King Gizzard & The Lizard Wizard شنیده می‌شود. Rockstar در اطلاعیه خود بار دیگر تاریخ انتشار بازی را ۱۹ نوامبر ۲۰۲۶ برای کنسول‌های PlayStation 5 و Xbox Series X|S تأیید کرد.",
    source: "https://www.rockstargames.com/newswire/article/517572321a549a/watch-the-grand-theft-auto-vi-launch-trailer"
  },
  {
    id: 7,
    title: "ایستگاه‌های رادیویی GTA VI معرفی شدند",
    date: "2026-10-08",
    category: "دنیای بازی",
    image: "./news-radio.png",
    summary: "Rockstar نگاهی به رادیوهای لئونیدا انداخت؛ از موسیقی لاتین و هیپ‌هاپ تا راک و برنامه‌های گفت‌وگومحور.",
    content: "Rockstar Games بخشی از اطلاعات مربوط به موسیقی و ایستگاه‌های رادیویی Grand Theft Auto VI را منتشر کرد. طبق معرفی رسمی، بازی گستره متنوعی از ایستگاه‌های رادیویی و پادکست‌ها را در اختیار بازیکنان قرار می‌دهد. سبک‌های موسیقی معرفی‌شده شامل موسیقی لاتین، کانتری، آفریقایی، متال، پاپ و هیپ‌هاپ هستند. تعدادی از ایستگاه‌ها نیز امکان شنیدن پیش‌نمایش آنلاین دارند.",
    source: "https://www.rockstargames.com/VI/music/back-country-radio"
  },
  {
    id: 8,
    title: "مجموعه محصولات رسمی GTA VI به فروشگاه Rockstar رسید",
    date: "2026-10-08",
    category: "اطلاعیه",
    image: "./news-merch.png",
    summary: "تی‌شرت‌ها، کلاه‌ها و کلکسیون‌های تازه با طرح GTA VI در فروشگاه رسمی Rockstar عرضه شدند.",
    content: "Rockstar Games از مجموعه رسمی محصولات الهام‌گرفته از Grand Theft Auto VI رونمایی کرد. این مجموعه شامل تی‌شرت‌هایی با طرح لوگوی GTA VI و Rockstar، کلاه‌های مخصوص، جاکلیدی، کیف پارچه‌ای، برچسب و برخی محصولات کلکسیونی است. تعدادی از طرح‌ها نیز از شخصیت‌ها و فضای خیالی لئونیدا الهام گرفته‌اند. محصولات از طریق فروشگاه رسمی Rockstar در دسترس قرار گرفته‌اند.",
    source: "https://www.rockstargames.com/newswire/article/759875393o5253/grand-theft-auto-vi-collection-now-at-the-rockstar-store"
  },
  {
    id: 9,
    title: "آلبوم رسمی موسیقی GTA VI با ۳۴ قطعه معرفی شد",
    date: "2026-09-17",
    category: "اطلاعیه",
    image: "./news-album.png",
    summary: "آلبوم رسمی GTA VI با همکاری Atlantic Records و شامل ۳۴ قطعه برای روز انتشار بازی برنامه‌ریزی شده است.",
    content: "Rockstar Games از آلبوم رسمی موسیقی Grand Theft Auto VI با همکاری Atlantic Records رونمایی کرد. این آلبوم شامل ۳۴ قطعه است و قرار است هم‌زمان با انتشار بازی در ۱۹ نوامبر ۲۰۲۶ عرضه شود. در زمان معرفی، شش قطعه از آلبوم برای شنیدن منتشر شدند. نسخه‌های دیجیتال، CD و وینیل نیز برای پیش‌ذخیره یا پیش‌خرید معرفی شدند.",
    source: "https://www.rockstargames.com/newswire/article/7599a881942544/announcing-grand-theft-auto-vi-the-album-coming-november-19"
  }
];
