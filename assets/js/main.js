(function () {
  "use strict";

  /**
   * Header toggle
   */
  const headerToggleBtn = document.querySelector(".header-toggle");

  function headerToggle() {
    document.querySelector("#header").classList.toggle("header-show");
    headerToggleBtn.classList.toggle("bi-list");
    headerToggleBtn.classList.toggle("bi-x");
  }
  headerToggleBtn.addEventListener("click", headerToggle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll("#navmenu a").forEach((navmenu) => {
    navmenu.addEventListener("click", () => {
      if (document.querySelector(".header-show")) {
        headerToggle();
      }
    });
  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll(".navmenu .toggle-dropdown").forEach((navmenu) => {
    navmenu.addEventListener("click", function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle("active");
      this.parentNode.nextElementSibling.classList.toggle("dropdown-active");
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector("#preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector(".scroll-top");

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100
        ? scrollTop.classList.add("active")
        : scrollTop.classList.remove("active");
    }
  }
  scrollTop.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  window.addEventListener("load", toggleScrollTop);
  document.addEventListener("scroll", toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }
  window.addEventListener("load", aosInit);

  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector(".typed");
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute("data-typed-items");
    typed_strings = typed_strings.split(",");
    new Typed(".typed", {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000,
    });
  }

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll(".skills-animation");
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: "80%",
      handler: function (direction) {
        let progress = item.querySelectorAll(".progress .progress-bar");
        progress.forEach((el) => {
          el.style.width = el.getAttribute("aria-valuenow") + "%";
        });
      },
    });
  });

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: ".glightbox",
  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener("load", function (e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: "smooth",
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll(".navmenu a");

  function navmenuScrollspy() {
    navmenulinks.forEach((navmenulink) => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight
      ) {
        document
          .querySelectorAll(".navmenu a.active")
          .forEach((link) => link.classList.remove("active"));
        navmenulink.classList.add("active");
      } else {
        navmenulink.classList.remove("active");
      }
    });
  }
  window.addEventListener("load", navmenuScrollspy);
  document.addEventListener("scroll", navmenuScrollspy);
})();

//portfolio(projects.json file)
document.addEventListener("DOMContentLoaded", () => {
  const projectsContainer = document.querySelector(".projects");
  const filters = document.querySelectorAll(".portfolio-filters li");

  // Fetch project items from the JSON file
  fetch("assets/json/projects.json")
    .then((response) => response.json())
    .then((data) => {
      // Sort projects by id in descending order
      const sortedData = data.sort((a, b) => b.id - a.id);

      // Generate project items dynamically
      const generateProjects = (filterCategory = "*") => {
        const filteredData =
          filterCategory === "*"
            ? sortedData
            : sortedData.filter((item) => item.category === filterCategory);

        // Add exit animation to all project items
        const currentItems =
          projectsContainer.querySelectorAll(".project-item");
        currentItems.forEach((item) => {
          item.classList.add("fade-out");
          item.addEventListener("animationend", () => {
            item.remove(); // Remove items after fade-out animation
          });
        });

        // Wait for exit animation to complete before adding new items
        setTimeout(() => {
          const projectsHTML = filteredData
            .map(
              (item) => `
            <div class="project-item ${item.category} fade-in">
              <img src="${item["index-image"]}" class="img-fluid" alt="${item.title}" />
              <div class="project-info">
                <a href="${item.detailsUrl}">
                  <p>${item.title}</p>
                </a>
              </div>
            </div>
          `
            )
            .join("");

          // Update the container with the generated HTML
          projectsContainer.innerHTML = projectsHTML;

          // Initialize GLightbox for preview functionality
          if (typeof GLightbox !== "undefined") {
            GLightbox({ selector: ".glightbox" });
          }
        }, 300); // Match the duration of the fade-out animation
      };

      // Initial render (show all projects sorted by id)
      generateProjects();

      // Filter functionality
      filters.forEach((filter) => {
        filter.addEventListener("click", () => {
          // Update active class
          filters.forEach((f) => f.classList.remove("filter-active"));
          filter.classList.add("filter-active");

          // Get filter category and render filtered projects
          const filterCategory = filter.getAttribute("data-filter");
          generateProjects(filterCategory === "*" ? "*" : filterCategory);
        });
      });
    })
    .catch((error) => console.error("Error loading project data:", error));
});

document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get("projectId");

  fetch("assets/json/Projects.json")
    .then((response) => response.json())
    .then((projects) => {
      const project = projects.find((item) => item.id === parseInt(projectId));

      if (project) {
        document.getElementById("project-description").textContent =
          project.description;

        // Populate additional details
        const portfolioInfo = document.querySelector(".portfolio-info ul");
        portfolioInfo.innerHTML = `
          ${
            project.title
              ? `<li><strong>Title:</strong> ${project.title}</li>`
              : ""
          }
          ${
            project.category
              ? `<li><strong>Category:</strong> ${project.category}</li>`
              : ""
          }
          ${
            project.purpose
              ? `<li><strong>Purpose:</strong> ${project.purpose}</li>`
              : ""
          }
          ${
            project.role
              ? `<li><strong>Role:</strong> ${project.role}</li>`
              : ""
          }
          ${
            project.techStack
              ? `<li><strong>Tech Stack:</strong> ${project.techStack.join(
                  ", "
                )}</li>`
              : ""
          }
              
        `;

        // Add key features
        if (project.keyFeatures && project.keyFeatures.length > 0) {
          document.querySelector(".key-features ul").innerHTML =
            project.keyFeatures
              .map(
                (feature) =>
                  `<li><strong>${feature.name}:</strong> ${feature.description}</li>`
              )
              .join("");
        } else {
          document.querySelector(".key-features").style.display = "none";
        }

        // Add technical details
        const technicalDetails = [];
        if (project.technicalDetails.frontend.length > 0) {
          technicalDetails.push(`
            <h4>Frontend :</h4>
            <ul>${project.technicalDetails.frontend
              .map((detail) => `<li>${detail}</li>`)
              .join("")}</ul>
          `);
        }
        if (project.technicalDetails.backend.length > 0) {
          technicalDetails.push(`
            <h4>Backend :</h4>
            <ul>${project.technicalDetails.backend
              .map((detail) => `<li>${detail}</li>`)
              .join("")}</ul>
          `);
        }
        if (project.technicalDetails.database) {
          technicalDetails.push(`
            <h4>Database :</h4>
            <p><span class='database'></span>${project.technicalDetails.database}</p>
          `);
        }
        if (project.technicalDetails.tools.length > 0) {
          technicalDetails.push(`
            <h4>Tools:</h4>
            <ul>${project.technicalDetails.tools
              .map((tool) => `<li>${tool}</li>`)
              .join("")}</ul>
          `);
        }
        if (technicalDetails.length > 0) {
          document.querySelector(".technical-details ul").innerHTML =
            technicalDetails.join("");
        } else {
          document.querySelector(".technical-details").style.display = "none";
        }

        // Add challenges solved
        if (project.challengesSolved && project.challengesSolved.length > 0) {
          document.querySelector(".challenges-solved ul").innerHTML =
            project.challengesSolved
              .map(
                (challenge, index) => `
                <li>
                  <p><strong>${index + 1}) Problem:</strong> ${
                  challenge.problem
                }</p>
                  <p><i class="bi bi-arrow-right-circle"></i> ${
                    challenge.solution
                  }</p>
                </li>
              `
              )
              .join("");
        } else {
          document.querySelector(".challenges-solved").style.display = "none";
        }

        // Add learning outcomes
        if (project.learningOutcomes && project.learningOutcomes.length > 0) {
          document.querySelector(".learning-outcomes ul").innerHTML =
            project.learningOutcomes
              .map((outcome) => `<li>${outcome}</li>`)
              .join("");
        } else {
          document.querySelector(".learning-outcomes").style.display = "none";
        }

        // Populate the image slider
        const swiperWrapper = document.querySelector(".swiper-wrapper");
        if (project.images && project.images.length > 0) {
          swiperWrapper.innerHTML = project.images
            .map(
              (image) =>
                `<div class="swiper-slide"><img src="${image}" alt="${project.title}" class="img-fluid" /></div>`
            )
            .join("");

          // Initialize Swiper if images exist
          const swiper = new Swiper(".portfolio-details-slider.swiper", {
            pagination: {
              el: ".swiper-pagination",
              type: "bullets",
              clickable: true,
            },
            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            },
          });
        } else {
          swiperWrapper.innerHTML =
            "<p>No images available for this project.</p>";
        }
      } else {
        document.getElementById("project-content").innerHTML =
          "<h2>Project Not Found</h2><p>The project you are looking for does not exist.</p>";
      }
    })
    .catch((error) => {
      console.error("Error fetching project data:", error);
      document.getElementById("project-content").innerHTML =
        "<h2>Error</h2><p>There was an error fetching the project details. Please try again later.</p>";
    });
});

fetch("./assets/json/service.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    renderServices(data.services);
  })
  .catch((error) => {
    console.error("Error loading services:", error);
  });

const renderServices = (services) => {
  const serviceList = document.getElementById("service-list");
  if (!serviceList) {
    console.error("Element with ID 'service-list' not found.");
    return;
  }

  services.forEach((service) => {
    const serviceItem = document.createElement("div");
    serviceItem.classList.add("col-lg-4", "col-md-6", "service-item", "d-flex");
    serviceItem.setAttribute("data-aos", "fade-up");

    serviceItem.innerHTML = `
            <div class="icon flex-shrink-0">
                <i class="${service.icon}"></i>
            </div>
            <div>
                <h4 class="title">
                    <a href="service-details.html?service=${service.id}" class="stretched-link">${service.title}</a>
                </h4>
                <p class="description">
                    ${service.description}
                </p>
            </div>
        `;

    serviceList.appendChild(serviceItem);
  });
};

//service-details.html
// Fetch JSON data from an external file
fetch("./assets/json/service.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to fetch JSON. Status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = parseInt(urlParams.get("service")); // Get service ID from URL
    const selectedService = data.services.find(
      (service) => service.id === serviceId
    );

    if (selectedService) {
      renderServiceList(selectedService);
      renderServiceDetails(selectedService["service-list"][0]); // Render the first service by default
    } else {
      console.error("Service not found for the given ID.");
    }
  })
  .catch((error) => {
    console.error("Error loading service details:", error);
  });

// Function to render the service list dynamically
const renderServiceList = (service) => {
  const serviceListContainer = document.querySelector(".services-list");
  const firstServiceTitle = document.querySelector(".col-lg-4 h3");
  const firstServiceDescription = document.querySelector(".col-lg-4 p");

  // Set the title and description for the main service
  firstServiceTitle.textContent = service.title;
  firstServiceDescription.textContent = service.descriptions;

  // Generate service list dynamically
  service["service-list"].forEach((subService, index) => {
    const serviceLink = document.createElement("a");
    serviceLink.href = "#";
    serviceLink.textContent = subService["sub-title"];
    if (index === 0) serviceLink.classList.add("active"); // Mark the first link as active
    serviceListContainer.appendChild(serviceLink);

    // Add click event listener to load sub-service details
    serviceLink.addEventListener("click", (event) => {
      event.preventDefault();

      // Highlight the active link
      document.querySelectorAll(".services-list a").forEach((link) => {
        link.classList.remove("active");
      });
      serviceLink.classList.add("active");

      // Render the clicked sub-service details
      renderServiceDetails(subService);
    });
  });
};

// Function to render the service details dynamically
const renderServiceDetails = (subService) => {
  const serviceContentContainer = document.querySelector(".col-lg-8");

  const serviceDetailsHTML = `
    <img src="${subService.image}" alt="${
    subService["sub-title"]
  }" class="img-fluid services-img" />
    <h3>${subService["sub-title"]}</h3>
    <p>${subService["sub-description"]}</p>
    <ul>
      ${subService.highlights
        .map(
          (item) =>
            `<li><i class="bi bi-check-circle"></i> <span>${item}</span></li>`
        )
        .join("")}
    </ul>
    <p>${subService["sub-details"]}</p>
  `;

  // Replace the content of the service details container
  serviceContentContainer.innerHTML = serviceDetailsHTML;
};

//portfolio(projects.json file)
document.addEventListener("DOMContentLoaded", () => {
  const projectsContainer = document.querySelector(".projects");
  const filters = document.querySelectorAll(".portfolio-filters li");
  const isIndexPage = window.location.pathname.includes("index.html"); // Check if on index page

  // Fetch project items from the JSON file
  fetch("assets/json/projects.json")
    .then((response) => response.json())
    .then((data) => {
      // Sort projects by id in descending order
      const sortedData = data.sort((a, b) => b.id - a.id);

      // Generate project items dynamically
      const generateProjects = (filterCategory = "*") => {
        const filteredData =
          filterCategory === "*"
            ? sortedData
            : sortedData.filter((item) => item.category === filterCategory);

        // If on index page, limit the displayed projects to 3
        const projectsToShow = isIndexPage ? filteredData.slice(0, 3) : filteredData;

        // Add exit animation to all project items
        const currentItems =
          projectsContainer.querySelectorAll(".project-item");
        currentItems.forEach((item) => {
          item.classList.add("fade-out");
          item.addEventListener("animationend", () => {
            item.remove(); // Remove items after fade-out animation
          });
        });

        // Wait for exit animation to complete before adding new items
        setTimeout(() => {
          const projectsHTML = projectsToShow
            .map(
              (item) => `
            <div class="project-item ${item.category} fade-in">
              <img src="${item["index-image"]}" class="img-fluid" alt="${item.title}" />
              <div class="project-info">
                <a href="${item.detailsUrl}">
                  <p>${item.title}</p>
                </a>
              </div>
            </div>
          `
            )
            .join("");

          // Update the container with the generated HTML
          projectsContainer.innerHTML = projectsHTML;

          // Initialize GLightbox for preview functionality
          if (typeof GLightbox !== "undefined") {
            GLightbox({ selector: ".glightbox" });
          }
        }, 300); // Match the duration of the fade-out animation
      };

      // Initial render (show all or only 3 projects based on page)
      generateProjects();

      // Filter functionality
      filters.forEach((filter) => {
        filter.addEventListener("click", () => {
          // Update active class
          filters.forEach((f) => f.classList.remove("filter-active"));
          filter.classList.add("filter-active");

          // Get filter category and render filtered projects
          const filterCategory = filter.getAttribute("data-filter");
          generateProjects(filterCategory === "" ? "" : filterCategory);
        });
      });
    })
    .catch((error) => console.error("Error loading project data:", error));
});