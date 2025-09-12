const header = document.getElementById('header');
const hamburger = document.querySelector('.hamburger');
const sideMenu = document.getElementById('sideMenu');
const closeBtn = document.getElementById('closeBtn');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 1);
});

hamburger.addEventListener('click', () => {
  sideMenu.classList.add('active');
});

closeBtn.addEventListener('click', () => {
  sideMenu.classList.remove('active');
});

// ---------------------- CONFIG ----------------------
const peopleAlsoSearchImages = {
  "https://www.trend-nest-latest-blog.name.ng/blog1.html": { img: "https://i.ibb.co/ksThg24J/file-0000000040c461f488a9759c8e9a7c07.webp", alt: "AI assistant on laptop screen used for freelancing and business" },
  "https://www.trend-nest-latest-blog.name.ng/blog2.html": { img: "https://i.ibb.co/DfsqsJLc/IMG-20250809-WA0003.webp", alt: "Content writer earning money online by publishing articles on Opera News Hub" },
  "https://www.trend-nest-latest-blog.name.ng/blog3.html": { img: "https://i.ibb.co/cSsQgNPT/file-0000000055f461fd924f8f59a9fe18c0.webp", alt: "Person using ChatGPT prompts to create income online" },
  "https://www.trend-nest-latest-blog.name.ng/blog4.html": { img: "https://i.ibb.co/fGFc0M7Q/file-000000003ee46246a2d11a7e3e6cd750.webp", alt: "User typing a ChatGPT prompt on a laptop for better results" },
  "https://www.trend-nest-latest-blog.name.ng/blog5.html": { img: "https://i.ibb.co/MmKC03r/IMG-20250809-WA0017-1.webp", alt: "People walking with umbrellas under cloudy sky" },
  "https://www.trend-nest-latest-blog.name.ng/index.html": { img: "https://i.ibb.co/Gf5c6hxp/IMG-20250809-WA0081.webp", alt: "How to make money with ChatGPT using real income strategies" }
};
// 🔄 Content Data
const peopleAlsoSearchData = [
  { link: "https://www.trend-nest-latest-blog.name.ng/blog1.html", title: "How to Turn ChatGPT Into a Side Hustle" },
  { link: "https://www.trend-nest-latest-blog.name.ng/blog2.html", title: "How to Make Money as a Content Writer" },
  { link: "https://www.trend-nest-latest-blog.name.ng/blog3.html", title: "5 Prompt Types You Can Use with ChatGPT to Earn Money" },
  { link: "https://www.trend-nest-latest-blog.name.ng/blog4.html", title: "What Is a Prompt? And How to Use Prompts to Get Better Results from ChatGPT" },
  { link: "https://www.trend-nest-latest-blog.name.ng/blog5.html", title: "Why the Weather Affects More Than Just Your Mood — And How to Plan Better Around It" }
];

const relatedBlocksData = [
  { link: "https://www.trend-nest-latest-blog.name.ng/blog6.html", title: "10 Ways Weather Shapes Your Daily Life (That Most People Don’t Realize)", img: "https://i.ibb.co/yLkkCSF/IMG-20250809-WA0028.webp" },
  { link: "https://www.trend-nest-latest-blog.name.ng/blog7.html", title: "Everything You Need to Know About WAEC in 2025", img: "https://i.ibb.co/wZwZCmyk/IMG-20250809-WA0043.webp" },
  { link: "https://www.trend-nest-latest-blog.name.ng/blog8.html", title: "How to Check WAEC Result in 2025 (Step-by-Step Guide)", img: "https://i.ibb.co/1JvDrq56/IMG-20250809-WA0047.webp" },
  { link: "https://www.trend-nest-latest-blog.name.ng/blog9.html", title: "How to Register for JAMB in 2025: Step-by-Step Guide for First-Timers", img: "https://i.ibb.co/qLQRLqcf/IMG-20250809-WA0065.webp" },
  { link: "https://www.trend-nest-latest-blog.name.ng/blog10.html", title: "How to Check JAMB Result Online in 2025 (Simple Guide for All Candidates)", img: "https://i.ibb.co/7dTd9HFc/IMG-20250809-WA0072.webp" },
  { link: "https://www.trend-nest-latest-blog.name.ng/blog11.html", title: "How Nigeria’s Education System Is Changing in 2025 — What You Should Know", img: "https://i.ibb.co/6cj2rWR9/IMG-20250809-WA0073-1.webp" },
  { link: "https://www.trend-nest-latest-blog.name.ng/blog12.html", title: "Top 5 Profitable Blog Niches in 2025 + AI Tools That Make Writing Easy", img: "https://i.ibb.co/Y7mYQFsp/IMG-20250809-WA0083.webp" },
  { link: "https://www.trend-nest-latest-blog.name.ng/blog13.html", title: "Anti-Inflammatory Foods to Add to Your Diet (Backed by Science)", img: "https://i.ibb.co/5g3ZMRxF/img-1754772036000.webp" },
  { link: "https://www.trend-nest-latest-blog.name.ng/blog14.html", title: "Telemedicine in Nigeria: How to Get Healthcare from Home in 2025", img: "https://i.ibb.co/dJ6WbLcG/IMG-20250809-WA0089.webp" },
  { link: "https://www.trend-nest-latest-blog.name.ng/blog15.html", title: "How Digital Classrooms Are Changing Education in Nigeria (2025 Update)", img: "https://i.ibb.co/sX1YW1Q/IMG-20250809-WA0097.webp" },
  { link: "https://www.trend-nest-latest-blog.name.ng/blog16.html", title: "How to Make Money with Your Smartphone in 2025", img: "https://i.ibb.co/spsYrtC6/IMG-20250809-WA0102.webp" },
  { link: "https://www.trend-nest-latest-blog.name.ng/blog17.html", title: "How People Are Using ChatGPT to Earn Real Income in 2025", img: "https://i.ibb.co/KcqkjyVQ/IMG-20250810-WA0004.webp" },
  { link: "https://www.trend-nest-latest-blog.name.ng/blog18.html", title: "7 Smart Ways to Use ChatGPT Every Day and Save Hours of Work", img: "https://i.ibb.co/yFMfZDyj/IMG-20250810-WA0006.webp" },
  { link: "https://www.trend-nest-latest-blog.name.ng/blog19.html", title: "10 Courses to Study in 2025 That Will Land You a Valuable Job", img: "https://i.ibb.co/1Y6CkqtX/file-000000002f5461f4a37cabe5a78e8837.webp" },
  { link: "https://www.trend-nest-latest-blog.name.ng/blog20.html", title: "Top 10 Short Courses & Certifications to Boost Your Career Fast in 2025", img: "https://i.ibb.co/2DnrCY1/IMG-20250810-WA0011.webp" }
];
// Merge both lists for shuffling
let combinedList = [...peopleAlsoSearchData, ...relatedBlocksData];
// Remove current page link
const currentPage = window.location.pathname.split("/").pop();
combinedList = combinedList.filter(item => item.link !== currentPage);
// Shuffle
combinedList.sort(() => Math.random() - 0.5);
// Split into People Also Search (5) & Related Blocks (remaining)
const peopleAlsoSearchItems = combinedList.slice(0, 5);
const relatedBlockItems = combinedList.slice(5, 15);
// Render People Also Search
document.querySelector(".search-tags").innerHTML = peopleAlsoSearchItems
  .map(item => `<a href="${item.link}"><span>${item.title}</span></a>`)
  .join("");
// Render Related Blocks
document.querySelector(".related-blocks").innerHTML = relatedBlockItems
  .map(item => `
    <a href="${item.link}">
      <div class="related-item">
        <img src="${item.img || getImageForPeopleAlsoSearch(item.link)}" alt="${item.title}" />
        <p>${item.title}</p>
      </div>
    </a>
   ` )
  .join("");
// Function to get images for People Also Search items
function getImageForPeopleAlsoSearch(link) {
  const map = {
    "https://www.trend-nest-latest-blog.name.ng/blog1.html": "https://i.ibb.co/ksThg24J/file-0000000040c461f488a9759c8e9a7c07.webp",
    "https://www.trend-nest-latest-blog.name.ng/blog2.html": "https://i.ibb.co/DfsqsJLc/IMG-20250809-WA0003.webp",
    "https://www.trend-nest-latest-blog.name.ng/blog3.html": "https://i.ibb.co/cSsQgNPT/file-0000000055f461fd924f8f59a9fe18c0.webp",
    "https://www.trend-nest-latest-blog.name.ng/blog4.html": "https://i.ibb.co/fGFc0M7Q/file-000000003ee46246a2d11a7e3e6cd750.webp",
    "https://www.trend-nest-latest-blog.name.ng/blog5.html": "https://i.ibb.co/MmKC03r/IMG-20250809-WA0017-1.webp",
    "index.html": "https://i.ibb.co/Gf5c6hxp/IMG-20250809-WA0081.webp"
  };
  return map[link] || "";
}
