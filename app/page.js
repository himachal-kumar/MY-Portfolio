import { personalData } from "@/utils/data/personal-data";
import AboutSection from "./components/homepage/about";
// import Blog from "./components/homepage/blog";
import ContactSection from "./components/homepage/contact";
import Education from "./components/homepage/education";
import Experience from "./components/homepage/experience";
import HeroSection from "./components/homepage/hero-section";
import Projects from "./components/homepage/projects";
import Skills from "./components/homepage/skills";

async function getData() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000); // 5-second timeout

  try {
    const res = await fetch(
      `https://dev.to/api/articles?username=${personalData.devUsername}`,
      { signal: controller.signal }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.statusText}`);
    }

    const data = await res.json();

    // Filter and shuffle blogs with a cover image
    return data.filter((item) => item?.cover_image).sort(() => Math.random() - 0.5);
  } catch (error) {
    if (error.name === "AbortError") {
      console.error("Fetch request timed out.");
    } else {
      console.error("Error fetching blogs:", error);
    }
    return []; // Return an empty array if the fetch fails
  } finally {
    clearTimeout(timeout);
  }
}

export default async function Home() {
  let blogs = [];

  try {
    blogs = await getData();
  } catch (error) {
    console.error("Error loading blogs on the server:", error);
  }

  return (
    <div suppressHydrationWarning>
      <HeroSection />
      <AboutSection />
      <Experience />
      <Skills />
      <Projects />
      <Education />
      {/* Uncomment the Blog section if needed */}
      {/* <Blog blogs={blogs} /> */}
      <ContactSection />
    </div>
  );
}
