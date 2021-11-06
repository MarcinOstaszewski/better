const { tableData } = require("./tableData");

const buildTable = (tableData) => {
    const tables = document.getElementById('tables');
    const date = tableData.date;

    const createDivWithClassName = (className) => {
        const el = document.createElement('div');
        el.className = className;
        return el;
    }

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
            const highlight = bookmaker.isMax ? 'highlight' : '';
            const sliderColumn = `
                <div class="slider-column flex-column ml-2">
                    <div class="column-title">
                        <img src="${bookmaker.logoUrl}" alt="${bookmaker.title}" width="180px" height="24px" />
                    </div>
                    <div class="column-scores flex-column mt-2 ${highlight}">
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

const sliderArrows = (className) => {
    const arrows = document.getElementsByClassName(className);
    const sliders = document.getElementsByClassName('slider');
    [].slice.apply(sliders).forEach( slider => {
        slider.style.position = 'absolute';
        slider.style.left = '0px';
        console.log(slider.style.left);
    });

    [].slice.apply(arrows).forEach( arrow => {
        arrow.addEventListener('click', e => {
            [].slice.apply(sliders).forEach( slider => {
                const dir = e.target.closest('.arrow').dataset.direction === 'right';
                let left = parseInt(slider.style.left);
                left += (dir ? 60 : -60);
                slider.style.left = left + 'px';
            })
        });
    })
}

document.addEventListener('DOMContentLoaded', () => {
    buildTable(tableData);
    sliderArrows('arrow');
});

