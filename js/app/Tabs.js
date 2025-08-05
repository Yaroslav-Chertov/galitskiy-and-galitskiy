import getQuery from '../utils/getQuery.js';
// import { overflow } from './utils/overflow.js';

/*
<button type="button" data-elts="tabBtn" data-tab="tab2" data-group="1">Кнопка, которая открывает Таб 2, Группа 1</button>
<div data-tab="tab2" data-group="1">Таб 2, Группа 1</div>

<button type="button" data-elts="tabBtn" data-tab="tab1">Кнопка, которая открывает Таб 1 без группы (то есть среди всех табов)</button>
<div data-tab="tab1" data-group="1">Таб 1, Без группы</div>

<button type="button" data-elts="tabBtnHistory" data-tab="tab1">Кнопка, которая открывает Таб 1 без группы (то есть среди всех табов) И ЗАПИСЫВАЕТ В location query параметр</button>
*/

export default class Tabs {
	constructor() {
        this.tabs = [...document.querySelectorAll('[data-tab], [data-elts~="tabBtn"], [data-elts~="tabBtnHistory"]')];

        this.tabsGroups = this.tabs.reduce((acc, elt) => {
            let { group } = elt.dataset;
            group = group || 'all';

            if (!acc[group]) {
                acc[group] = [];
            }

            acc[group].push(elt);

            return acc;
        }, {})

        this.readTab();

        document.addEventListener('click', this.handleTabClickEvent);
        window.addEventListener('resize', this.handleTabResize);
	}

    handleTabResize = (e) => {
        /* if (window.innerWidth <= 1024 && this.selected) {
            overflow.on();
        }
        if (window.innerWidth > 1024 && this.selected) {
            overflow.off();
        } */
    }

    handleTabClickEvent = (e) => {
        const tabBtn = e.target.closest('[data-elts~="tabBtn"], [data-elts~="tabBtnHistory"]');

        if (tabBtn) {
            if (this.selected === tabBtn.dataset.tab) return this.clearTabs(tabBtn.dataset.group);

            this.setTabs({
                tab: tabBtn.dataset.tab,
                group: tabBtn.dataset.group || 'all',
                updateHistory: tabBtn.dataset?.elts === 'tabBtnHistory'
            });
        }

        const tabCloseAllBtn = e.target.closest('[data-elts~="closeAllTabs"]');

        if (tabCloseAllBtn) {
            this.clearTabs(tabCloseAllBtn.dataset?.group);

            /* if (window.innerWidth <= 1024) {
                overflow.off();
            } */
        }
    }

	setTabs = ({tab, group = 'all', updateHistory = false}) => {
        if (tab === undefined) return console.log(`Нет таба с аттрибутом data-tab="${tab}"`);

        /* if (window.innerWidth <= 1024) {
            overflow.on();
        } */

        [...document.querySelectorAll('[data-tab]')].map(t => {
            t.classList.toggle('is-active', tab === t.dataset.tab)
        });

        clearTimeout(this.tabTM);
        this.tabTM = setTimeout(() => {
            [...document.querySelectorAll('[data-tab]')].map(t => {
                t.classList.toggle('is-animate', tab === t.dataset.tab)
            });
        }, 0);

        this.selected = tab;

        if (updateHistory) {
            history.replaceState(null, null, `?tab=${tab}`);
        }
	}

	clearTabs = (group = 'all') =>{
        this.selected = null;

        if (group) {
            this.tabsGroups[group].map(t => {
                t.classList.remove('is-active')

                if (t.closest('.services__list')) {
                    t.closest('.services__list').classList.remove('is-selected');
                }
            });
            return;
        }

        this.tabs.map(t => t.classList.remove('is-active'));

        /* if (window.innerWidth <= 1024) {
            overflow.off();
        } */
	}

    readTab = () => {
        const query = getQuery();
        const tab = query.tab;
        const group = query.group;

        if (!tab) return;

        const validTab = this.tabs.find(t => tab === t.dataset.tab);

        if (!validTab) return;

        this.setTabs({ tab, group });
    }
}
