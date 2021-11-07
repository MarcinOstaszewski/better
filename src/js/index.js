'use strict';

const breakPoint = 768;
let lastWindowWidth = window.innerWidth;
let offsetValue = 136;

const createDivWithClassName = (className) => {
    const el = document.createElement('div');
    el.className = className;
    return el;
}

const buildTable = (tableData) => {
    const tables = document.getElementById('tables');
    const date = tableData.date;

    tableData.rows.forEach(row => {
        // create header content
        const headMain = `
            <div class="head-main">
                <div class="head-main-date d-flex align-items-end">
                    <div class="desktop">${date}</div>
                    <div class="mobile">${date.slice(-8)}</div>
                </div>
                <div class="head-main-content flex-column mt-2">
                    <div class="desktop">${row.teams.over.name.long}</div>
                    <div class="mobile">${row.teams.over.name.short}</div>
                    <div class="desktop">${row.teams.under.name.long}</div>
                    <div class="mobile">${row.teams.under.name.short}</div>
                </div>
            </div>`;

        const headConsensus = `
            <div class="head-consensus ml-3">
             <div class="head-consensus-title">CONSENSUS</div>
                <div class="head-consensus-content flex-column mt-2">
                    <div class="desktop">${row.teams.over.consensus}</div>
                    <div class="desktop">${row.teams.under.consensus}</div>
                </div>
            </div>
        `;

        const head = createDivWithClassName('head d-flex');
        head.innerHTML = (headMain + headConsensus).trim();

        // create slider content
        const slider = createDivWithClassName('slider d-flex');

        row.bookmakers.forEach( bookmaker => {
            // attach a column for each bookmaker
            const overLine = bookmaker.over.line ? `<div class="line">${bookmaker.over.line}</div>` : '';
            const underLine = bookmaker.under.line ? `<div class="line">${bookmaker.under.line}</div>` : '';
            const highlight = bookmaker.isMax ? ' highlight' : '';
            const sliderColumn = `
                <div class="slider-column flex-column">
                    <div class="column-title">
                        <img src="${bookmaker.logoUrl}" alt="${bookmaker.title}" width="180px" height="24px" />
                    </div>
                    <div class="column-scores flex-column mt-2${highlight}">
                        <div class="scores-field scores-over">
                            ${overLine}
                            <div class="odds">${bookmaker.over.odds}</div>
                        </div>
                        <div class="scores-field scores-under">
                            ${underLine}
                            <div class="odds">${bookmaker.under.odds}</div>
                        </div>
                    </div>
                </div>
            `;
            slider.innerHTML += sliderColumn.trim();
        })

        // create row content, then attach header and slider
        const content = createDivWithClassName('tables-row-content d-flex');
        const sliderBox = createDivWithClassName('slider-box');
        sliderBox.appendChild(slider);
        content.appendChild(head);
        content.appendChild(sliderBox);

        // create row element and title, then attach title and content
        const rowElem = createDivWithClassName('tables-row row flex-column mb-4');
        const title = createDivWithClassName('tables-row-title');
        title.innerText = row.rowTitle + ' odds';
        rowElem.appendChild(title);
        rowElem.appendChild(content);

        tables.appendChild(rowElem);
    });
}

const setSlidersOffset = offset => {
    const sliders = getByClass('slider');
    sliders.forEach(slider => {
        slider.style.left = (offset) + 'px';
    });
}

const handleScreenWidthChange = () => {
    const windowWidthCrossedBreakPoint = (lastWindowWidth > breakPoint && window.innerWidth < breakPoint ||
        lastWindowWidth < breakPoint && window.innerWidth > breakPoint);
    if (windowWidthCrossedBreakPoint) {
        setSlidersOffset(0);
        disableArrows();
        updateArrows(0);
        lastWindowWidth = window.innerWidth;
    }
}

const getByClass = className => [].slice.apply(document.getElementsByClassName(className));

const disableArrows = () => {
    getByClass('arrow').forEach( a => a.classList.add('disabled') );
}

const updateArrows = (offsetLeft) => {
    const arrows = getByClass('arrow');
    const slider = getByClass('slider')[0];
    const box = getByClass('slider-box')[0];
    if (box.offsetWidth - offsetLeft < slider.offsetWidth) {
        arrows[0].classList.remove('disabled');
    }
    if (box.offsetWidth - offsetLeft > box.offsetWidth) {
        arrows[1].classList.remove('disabled');
    }
}

const animateSliders = (sliders, multiplier) => {
    disableArrows();
    const targetLeft = (parseInt(sliders[0].style.left) || 0) + offsetValue * multiplier;

    const animate = () => {
        const currLeft = parseInt(sliders[0].style.left) || 0;
        const offsetNotReached = multiplier < 0 && targetLeft < currLeft || multiplier > 0 && targetLeft > currLeft;
        if (offsetNotReached) {
            setSlidersOffset(currLeft + (4 * multiplier));
        } else {
            clearInterval(id);
            updateArrows(targetLeft);
        }
    }

    let id = window.setInterval(animate, 5);
}

const initArrows = () => {
    const arrows = getByClass('arrow');
    const sliders = getByClass('slider');
    if (arrows.length === 0 || sliders.length === 0) {
        return;
    }
    arrows.forEach( arrow => {
        arrow.addEventListener('click', e => {
            const multiplier = parseInt(e.target.closest('.arrow').dataset.multiplier);
            animateSliders(sliders, multiplier);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    buildTable(tableData);
    initArrows();
    disableArrows();
    updateArrows(0);
    window.addEventListener('resize', () => {
        handleScreenWidthChange();
    });
});
