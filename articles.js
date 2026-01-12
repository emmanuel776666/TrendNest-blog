// code for hamburger 
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

// this for related search and people also ask ---------------------- CONFIG ----------------------
const peopleAlsoSearchImages = {
  "blog1.html": { img: "https://i.ibb.co/ksThg24J/file-0000000040c461f488a9759c8e9a7c07.webp", alt: "AI assistant on laptop screen used for freelancing and business", loading: "lazy" },
  "blog2.html": { img: "https://i.ibb.co/DfsqsJLc/IMG-20250809-WA0003.webp", alt: "Content writer earning money online by publishing articles on Opera News Hub", loading:"lazy" },
  "blog3.html": { img: "https://i.ibb.co/cSsQgNPT/file-0000000055f461fd924f8f59a9fe18c0.webp", alt: "Person using ChatGPT prompts to create income online" ,loading: "lazy" },
  "blog4.html": { img: "https://i.ibb.co/fGFc0M7Q/file-000000003ee46246a2d11a7e3e6cd750.webp", alt: "User typing a ChatGPT prompt on a laptop for better results", loading: "lazy" },
  "blog5.html": { img: "https://i.ibb.co/MmKC03r/IMG-20250809-WA0017-1.webp", alt: "People walking with umbrellas under cloudy sky", loading:"lazy" },
  "index.html": { img: "https://i.ibb.co/Gf5c6hxp/IMG-20250809-WA0081.webp", alt: "How to make money with ChatGPT using real income strategies", loading: "lazy" }
};
// 🔄 Content Data
const peopleAlsoSearchData = [
  { link: "blog1.html", title: "How to Turn ChatGPT Into a Side Hustle" },
  { link: "blog2.html", title: "How to Make Money as a Content Writer" },
  { link: "blog3.html", title: "5 Prompt Types You Can Use with ChatGPT to Earn Money" },
  { link: "blog4.html", title: "What Is a Prompt? And How to Use Prompts to Get Better Results from ChatGPT" },
  { link: "blog5.html", title: "Why the Weather Affects More Than Just Your Mood — And How to Plan Better Around It" }
];

const relatedBlocksData = [
  { link: "blog6.html", title: "10 Ways Weather Shapes Your Daily Life (That Most People Don’t Realize)", img: "https://i.ibb.co/yLkkCSF/IMG-20250809-WA0028.webp", loading:"lazy" },
  { link: "blog7.html", title: "Everything You Need to Know About WAEC in 2025", img: "https://i.ibb.co/wZwZCmyk/IMG-20250809-WA0043.webp", loading: "lazy" },
  { link: "blog8.html", title: "How to Check WAEC Result in 2025 (Step-by-Step Guide)", img: "https://i.ibb.co/1JvDrq56/IMG-20250809-WA0047.webp", loading: "lazy" },
  { link: "blog9.html", title: "How to Register for JAMB in 2025: Step-by-Step Guide for First-Timers", img: "https://i.ibb.co/qLQRLqcf/IMG-20250809-WA0065.webp", loading: "lazy" },
  { link: "blog10.html", title: "How to Check JAMB Result Online in 2025 (Simple Guide for All Candidates)", img: "https://i.ibb.co/7dTd9HFc/IMG-20250809-WA0072.webp", loading: "lazy" },
  { link: "blog11.html", title: "How Nigeria’s Education System Is Changing in 2025 — What You Should Know", img: "https://i.ibb.co/6cj2rWR9/IMG-20250809-WA0073-1.webp", loading: "lazy" },
  { link: "blog12.html", title: "Top 5 Profitable Blog Niches in 2025 + AI Tools That Make Writing Easy", img: "https://i.ibb.co/Y7mYQFsp/IMG-20250809-WA0083.webp", loading: "lazy" },
  { link: "blog13.html", title: "Anti-Inflammatory Foods to Add to Your Diet (Backed by Science)", img: "https://i.ibb.co/5g3ZMRxF/img-1754772036000.webp", loading: "lazy" },
  { link: "blog14.html", title: "Telemedicine in Nigeria: How to Get Healthcare from Home in 2025", img: "https://i.ibb.co/dJ6WbLcG/IMG-20250809-WA0089.webp", loading: "lazy" },
  { link: "blog15.html", title: "How Digital Classrooms Are Changing Education in Nigeria (2025 Update)", img: "https://i.ibb.co/sX1YW1Q/IMG-20250809-WA0097.webp", loading: "lazy" },
  { link: "blog16.html", title: "How to Make Money with Your Smartphone in 2025", img: "https://i.ibb.co/spsYrtC6/IMG-20250809-WA0102.webp", loading: "lazy" },
  { link: "blog17.html", title: "How People Are Using ChatGPT to Earn Real Income in 2025", img: "https://i.ibb.co/KcqkjyVQ/IMG-20250810-WA0004.webp", loading: "lazy" },
  { link: "blog18.html", title: "7 Smart Ways to Use ChatGPT Every Day and Save Hours of Work", img: "https://i.ibb.co/yFMfZDyj/IMG-20250810-WA0006.webp", loading: "lazy" },
  { link: "blog19.html", title: "10 Courses to Study in 2025 That Will Land You a Valuable Job", img: "https://i.ibb.co/1Y6CkqtX/file-000000002f5461f4a37cabe5a78e8837.webp", loading: "lazy" },
  { link: "blog20.html", title: "Top 10 Short Courses & Certifications to Boost Your Career Fast in 2025", img: "https://i.ibb.co/2DnrCY1/IMG-20250810-WA0011.webp", loading: "lazy" },
  { link: "kindle.html", title: "Best Amazon Kindle eReaders 2025 – Prices, Reviews & Where to Buy Online", img: "https://i.ibb.co/PsWcfh4s/Y2-Rm-MTcz-YTUt-CB544958490.webp", loading: "lazy" },
  { link: "iphonepro.html", title: "iPhone 17 Pro Max – Price, Release Date, and Full Specs (Worldwide Update 2025)", img: "https://i.ibb.co/bMFntPsN/images-2.webp", loading: "lazy" }
  
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
  .map(item => <a href="${item.link}"><span>${item.title}</span></a>)
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
  `)
  .join("");
// Function to get images for People Also Search items
function getImageForPeopleAlsoSearch(link) {
  const map = {
    "blog1.html": "https://i.ibb.co/ksThg24J/file-0000000040c461f488a9759c8e9a7c07.webp", loading: "lazy",
    "blog2.html": "https://i.ibb.co/DfsqsJLc/IMG-20250809-WA0003.webp", loading: "lazy",
    "blog3.html": "https://i.ibb.co/cSsQgNPT/file-0000000055f461fd924f8f59a9fe18c0.webp",
    "blog4.html": "https://i.ibb.co/fGFc0M7Q/file-000000003ee46246a2d11a7e3e6cd750.webp", loading: "lazy",
    "blog5.html": "https://i.ibb.co/MmKC03r/IMG-20250809-WA0017-1.webp", loading: "lazy",
    "index.html": "https://i.ibb.co/Gf5c6hxp/IMG-20250809-WA0081.webp", loading: "lazy"
  };
  return map[link] || "";
}
// this part is the code that protect my page from right click and others
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});
 document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && (e.key === 'c' || e.key === 'u' || e.key === 's')) {
      e.preventDefault();
    }
});

// Check if accepted before
if (!localStorage.getItem('cookieAccepted')) {
  const banner = document.createElement('div');
  banner.id = 'cookie-banner';
  banner.innerHTML = `
   <p id="head1"><strong>Consent to cookies & data processing</strong></p> <p>
      This website uses cookies to improve user experience, show ads, and analyze traffic (including IP address data).
      By using this site, you agree to our use of cookies.
    </p>
    <button id="acceptCookies">Accept All</button>
  `;
  document.body.appendChild(banner);

  // Show after 10 seconds
  setTimeout(() => {
    banner.classList.add('show');
  }, 10000);

  // On click, hide and remember
  document.getElementById('acceptCookies').onclick = () => {
    localStorage.setItem('cookieAccepted', 'yes');
    banner.style.display = 'none';
  };
}







// auto.js
const { Query } = Appwrite;

function getSlugFromURL() {
    const path = window.location.pathname;
    const parts = path.split("/").filter(Boolean);

    // URL: /articles.html/how-to-ai-to-make-money
    return parts.length > 1 ? parts[parts.length - 1] : null;
}

async function loadPostBySlug() {
    try {
        const slug = getSlugFromURL();

        if (!slug) {
            document.getElementById("post-body").innerText = "No article specified.";
            return;
        }

        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [Query.equal("slug", slug)]
        );

        if (response.documents.length === 0) {
            document.getElementById("post-body").innerText = "Post not found.";
            return;
        }

        const post = response.documents[0];

        // Format date
        const date = new Date(post.$createdAt).toDateString();
        document.getElementById("publish-date").innerText = "Published " + date;

        // Content
        document.getElementById("post-title").innerText = post.subheading;
        document.getElementById("post-image").src = post.image;
        document.getElementById("post-body").innerHTML = marked.parse(post.content || "");

        // Canonical URL
        const fullURL = `https://www.trend-nest-latest-blog.name.ng/articles.html?slug=${post.slug}`;
        document.getElementById("canonical-link").setAttribute("href", fullURL);

        // SEO
        updateSEO(post, fullURL);

        // Schema
        injectSchema(post, fullURL);

    } catch (error) {
        console.error("Appwrite Error:", error);
        document.getElementById("post-body").innerText = "Error loading post.";
    }
}

function updateSEO(post, url) {
    document.getElementById("page-title").innerText = `${post.title} | TrendNest`;
    document.getElementById("meta-description").setAttribute("content", post.description || "");
    document.getElementById("meta-keywords").setAttribute("content", post.keyword || "");

    // Open Graph
    document.getElementById("og-title").setAttribute("content", post.title);
    document.getElementById("og-description").setAttribute("content", post.description || "");
    document.getElementById("og-image").setAttribute("content", post.image);
    document.getElementById("og-url").setAttribute("content", url);

    // Twitter
    document.getElementById("twitter-title").setAttribute("content", post.title);
    document.getElementById("twitter-image").setAttribute("content", post.image);
}

function injectSchema(post, url) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": post.description || "",
        "image": post.image,
        "datePublished": post.$createdAt,
        "dateModified": post.$updatedAt,
        "author": {
            "@type": "person",
            "name": "MEC",
            "url": "https://www.trend-nest-latest-blog.name.ng/mec/"
        },
        "publisher": {
            "@type": "Organization",
            "name": "TrendNest",
            "logo": {
                "@type": "ImageObject",
                "url": "https://raw.githubusercontent.com/emmanuel776666/TrendNest-blog/refs/heads/main/IMG-20250818-WA0002.png"
            }
        },
        "url": url,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": url
        }
    };

    document.getElementById("post-schema").innerText = JSON.stringify(schema);
}

// Start
loadPostBySlug();






