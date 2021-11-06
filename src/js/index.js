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

        const content = createDivWithClassName('tables-row-content d-flex');
        content.appendChild(head)

        const title = createDivWithClassName('tables-row-title');
        const elem = createDivWithClassName('tables-row row flex-column mb-4');
        elem.appendChild(title);
        elem.appendChild(content);

        title.innerText = row.rowTitle + ' odds';








        const contentSlider = createDivWithClassName('tables-row-content-slider')


        tables.appendChild(elem);
    });
}

document.addEventListener('DOMContentLoaded', buildTable(tableData));

