// ===========================
// GLOBAL CHART.JS DEFAULTS
// ===========================
Chart.defaults.color = '#8892b0';
Chart.defaults.font.family = "'Inter', -apple-system, sans-serif";
Chart.defaults.font.size = 12;

// chartjs-plugin-annotation auto-registers itself when loaded via CDN
// (it detects Chart.js on the window and calls Chart.register() internally)

// ===========================
// CHART 1: RESERVE CURRENCIES
// ===========================
function initReserveCurrencyChart() {
  const ctx = document.getElementById('reserveCurrencyChart');
  if (!ctx) return;

  const labels = [
    'Portuguese Empire\n(Escudo · 1450–1530)',
    'Spanish Empire\n(Real · 1530–1640)',
    'Dutch Republic\n(Guilder · 1640–1720)',
    'French Empire\n(Livre · 1720–1815)',
    'British Empire\n(Pound · 1815–1920)',
    'United States\n(Dollar · 1944–present)',
  ];

  // Wrap long labels for display
  const displayLabels = [
    ['Portuguese Empire', '(~1450–1530)'],
    ['Spanish Empire', '(~1530–1640)'],
    ['Dutch Republic', '(~1640–1720)'],
    ['French Empire', '(~1720–1815)'],
    ['British Empire', '(~1815–1920)'],
    ['United States', '(1944–present)'],
  ];

  const durations = [80, 110, 80, 95, 105, 81];

  const barColors = [
    'rgba(99, 102, 241, 0.7)',   // purple - Portugal
    'rgba(139, 92, 246, 0.7)',   // violet - Spain
    'rgba(59, 130, 246, 0.7)',   // blue - Netherlands
    'rgba(6, 182, 212, 0.7)',    // cyan - France
    'rgba(20, 184, 166, 0.7)',   // teal - Britain
    'rgba(247, 147, 26, 0.85)',  // bitcoin orange - USA
  ];

  const borderColors = [
    'rgba(99, 102, 241, 1)',
    'rgba(139, 92, 246, 1)',
    'rgba(59, 130, 246, 1)',
    'rgba(6, 182, 212, 1)',
    'rgba(20, 184, 166, 1)',
    'rgba(247, 147, 26, 1)',
  ];

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: displayLabels,
      datasets: [
        {
          label: 'Years as Reserve Currency',
          data: durations,
          backgroundColor: barColors,
          borderColor: borderColors,
          borderWidth: 1.5,
          borderRadius: 6,
          borderSkipped: false,
        }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(13, 17, 36, 0.95)',
          borderColor: 'rgba(247, 147, 26, 0.3)',
          borderWidth: 1,
          titleColor: '#f0f4ff',
          bodyColor: '#8892b0',
          padding: 14,
          callbacks: {
            title(items) {
              const labelArr = displayLabels[items[0].dataIndex];
              return labelArr.join(' ');
            },
            label(item) {
              const isUSD = item.dataIndex === 5;
              const val = item.raw;
              return isUSD
                ? ` ${val}+ years (ongoing)`
                : ` ${val} years`;
            },
          }
        },
        annotation: {
          annotations: {
            avgLine: {
              type: 'line',
              xMin: 94,
              xMax: 94,
              borderColor: 'rgba(255, 255, 255, 0.25)',
              borderWidth: 2,
              borderDash: [6, 4],
              label: {
                content: 'Avg: 94 yrs',
                display: true,
                color: 'rgba(255,255,255,0.5)',
                backgroundColor: 'rgba(13, 17, 36, 0.8)',
                font: { size: 11, weight: '600' },
                position: 'end',
                yAdjust: -14,
              }
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.04)',
            drawBorder: false,
          },
          border: { display: false },
          ticks: {
            color: '#5a6480',
            callback: v => v + ' yrs',
          },
          title: {
            display: true,
            text: 'Years as Dominant Global Reserve Currency',
            color: '#5a6480',
            font: { size: 11 },
            padding: { top: 12 }
          },
          min: 0,
          max: 130,
        },
        y: {
          grid: { display: false },
          border: { display: false },
          ticks: {
            color: '#8892b0',
            font: { size: 12 },
          }
        }
      }
    }
  });
}

// ===========================
// CHART 2: US DEBT TO GDP
// ===========================
function initDebtGdpChart() {
  const ctx = document.getElementById('debtGdpChart');
  if (!ctx) return;

  // US Federal Debt as % of GDP — approximate values from FRED/CBO
  const years = [
    '1940','1945','1950','1955','1960','1965','1970',
    '1975','1980','1985','1990','1995','2000','2005',
    '2008','2009','2010','2015','2019','2020','2021',
    '2022','2023','2024','2025'
  ];

  const debtGDP = [
    52, 119, 94, 69, 54, 43, 37,
    35, 33, 44, 56, 67, 55, 63,
    68, 83, 95, 105, 108, 135, 126,
    122, 123, 124, 127
  ];

  // Color each point: red if >= 100, orange if 80-100, green otherwise
  const pointColors = debtGDP.map(v =>
    v >= 100 ? 'rgba(239, 68, 68, 0.9)' :
    v >= 80 ? 'rgba(247, 147, 26, 0.9)' :
    'rgba(16, 185, 129, 0.7)'
  );

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: years,
      datasets: [
        {
          label: 'Debt/GDP %',
          data: debtGDP,
          borderColor: 'rgba(247, 147, 26, 0.9)',
          backgroundColor: (context) => {
            const chart = context.chart;
            const { ctx: canvasCtx, chartArea } = chart;
            if (!chartArea) return 'transparent';
            const gradient = canvasCtx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, 'rgba(247, 147, 26, 0.2)');
            gradient.addColorStop(1, 'rgba(247, 147, 26, 0.0)');
            return gradient;
          },
          fill: true,
          tension: 0.35,
          borderWidth: 2.5,
          pointRadius: 4,
          pointHoverRadius: 7,
          pointBackgroundColor: pointColors,
          pointBorderColor: pointColors,
          pointBorderWidth: 0,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(13, 17, 36, 0.95)',
          borderColor: 'rgba(247, 147, 26, 0.3)',
          borderWidth: 1,
          titleColor: '#f0f4ff',
          bodyColor: '#8892b0',
          padding: 14,
          callbacks: {
            label(item) {
              return ` Debt/GDP: ${item.raw}%`;
            }
          }
        },
        annotation: {
          annotations: {
            hundredLine: {
              type: 'line',
              yMin: 100,
              yMax: 100,
              borderColor: 'rgba(239, 68, 68, 0.4)',
              borderWidth: 1.5,
              borderDash: [6, 4],
              label: {
                content: '100% — Debt = GDP',
                display: true,
                color: 'rgba(239, 68, 68, 0.7)',
                backgroundColor: 'rgba(13, 17, 36, 0.85)',
                font: { size: 11, weight: '600' },
                position: 'start',
                xAdjust: 8,
              }
            },
            wwiiLabel: {
              type: 'point',
              xValue: '1945',
              yValue: 119,
              radius: 0,
              label: {
                content: 'WWII Peak: 119%',
                display: true,
                color: 'rgba(255,255,255,0.4)',
                backgroundColor: 'rgba(13, 17, 36, 0.8)',
                font: { size: 10 },
                position: 'right',
                xAdjust: 6,
                yAdjust: -16,
              }
            },
            covidLabel: {
              type: 'point',
              xValue: '2020',
              yValue: 135,
              radius: 0,
              label: {
                content: 'COVID: 135%',
                display: true,
                color: 'rgba(255,255,255,0.4)',
                backgroundColor: 'rgba(13, 17, 36, 0.8)',
                font: { size: 10 },
                position: 'right',
                xAdjust: 6,
                yAdjust: -16,
              }
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.03)',
            drawBorder: false,
          },
          border: { display: false },
          ticks: {
            color: '#5a6480',
            maxRotation: 45,
            autoSkip: true,
            maxTicksLimit: 12,
          }
        },
        y: {
          grid: {
            color: 'rgba(255, 255, 255, 0.04)',
            drawBorder: false,
          },
          border: { display: false },
          ticks: {
            color: '#5a6480',
            callback: v => v + '%',
          },
          title: {
            display: true,
            text: 'Federal Debt as % of GDP',
            color: '#5a6480',
            font: { size: 11 },
          },
          min: 0,
          max: 150,
        }
      }
    }
  });
}

// ===========================
// CHART 3: US SAVINGS RATE
// ===========================
function initSavingsRateChart() {
  const ctx = document.getElementById('savingsRateChart');
  if (!ctx) return;

  // US Personal Savings Rate (PSAVERT) — approximate annual values, FRED
  const years = [
    '1960','1962','1964','1966','1968','1970','1971',
    '1973','1975','1977','1979','1981','1983','1985',
    '1987','1989','1991','1993','1995','1997','1999',
    '2001','2003','2005','2007','2009','2011','2013',
    '2015','2017','2019','2020','2021','2022','2023','2024'
  ];

  const rates = [
    8.3, 8.6, 9.3, 9.8, 10.4, 11.0, 10.7,
    10.1, 13.0, 12.1, 10.6, 11.8, 9.7, 8.6,
    7.5, 7.7, 8.3, 7.1, 5.6, 4.9, 3.5,
    3.0, 2.7, 2.1, 2.3, 5.4, 5.4, 5.1,
    6.1, 6.3, 7.7, 16.8, 11.9, 3.3, 4.1, 3.9
  ];

  const pointColors = rates.map((v, i) => {
    if (years[i] === '1971') return 'rgba(247, 147, 26, 1)';
    if (v >= 9)  return 'rgba(16, 185, 129, 0.85)';
    if (v >= 5)  return 'rgba(247, 147, 26, 0.85)';
    return 'rgba(239, 68, 68, 0.85)';
  });

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: years,
      datasets: [{
        label: 'Personal Savings Rate',
        data: rates,
        borderColor: 'rgba(247, 147, 26, 0.85)',
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx: c, chartArea } = chart;
          if (!chartArea) return 'transparent';
          const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          g.addColorStop(0, 'rgba(247, 147, 26, 0.18)');
          g.addColorStop(1, 'rgba(247, 147, 26, 0)');
          return g;
        },
        fill: true,
        tension: 0.35,
        borderWidth: 2.5,
        pointRadius: 4,
        pointHoverRadius: 7,
        pointBackgroundColor: pointColors,
        pointBorderColor: 'transparent',
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(13, 17, 36, 0.95)',
          borderColor: 'rgba(247, 147, 26, 0.3)',
          borderWidth: 1,
          titleColor: '#f0f4ff',
          bodyColor: '#8892b0',
          padding: 14,
          callbacks: {
            label: item => ` Savings Rate: ${item.raw}%`
          }
        },
        annotation: {
          annotations: {
            nixonLine: {
              type: 'line',
              xMin: '1971',
              xMax: '1971',
              borderColor: 'rgba(247, 147, 26, 0.65)',
              borderWidth: 2,
              borderDash: [6, 4],
              label: {
                content: 'Nixon Shock — Aug 15, 1971',
                display: true,
                color: 'rgba(247, 147, 26, 0.9)',
                backgroundColor: 'rgba(13, 17, 36, 0.88)',
                font: { size: 11, weight: '600' },
                position: 'start',
                yAdjust: -16,
              }
            },
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.03)', drawBorder: false },
          border: { display: false },
          ticks: { color: '#5a6480', maxTicksLimit: 10 }
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
          border: { display: false },
          ticks: { color: '#5a6480', callback: v => v + '%' },
          title: {
            display: true,
            text: 'Personal Savings Rate (%)',
            color: '#5a6480',
            font: { size: 11 }
          },
          min: 0,
          max: 20,
        }
      }
    }
  });
}

// ===========================
// ACCORDION
// ===========================
function initAccordion() {
  document.querySelectorAll('.accordion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.accordion-item');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.accordion-item').forEach(el => {
        el.classList.remove('open');
        el.querySelector('.accordion-btn').setAttribute('aria-expanded', 'false');
      });

      // Open clicked if it was closed
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

// ===========================
// NAVBAR SCROLL EFFECT
// ===========================
function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Mobile toggle
  const toggle = document.getElementById('navToggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });
    // Close on link click
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }
}

// ===========================
// SECTION FADE-IN ON SCROLL
// ===========================
function initScrollAnimations() {
  const sections = document.querySelectorAll('.section');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
        }
      });
    },
    { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
  );

  sections.forEach(s => {
    s.style.opacity = '0';
    s.style.transform = 'translateY(20px)';
    s.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(s);
  });
}

// ===========================
// INIT
// ===========================
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initAccordion();
  initScrollAnimations();

  // Charts need a slight delay to ensure containers have dimensions
  requestAnimationFrame(() => {
    initReserveCurrencyChart();
    initDebtGdpChart();
    initSavingsRateChart();
  });
});
