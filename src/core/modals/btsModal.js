import { DIV_TAG, CLICK_EVENT, ARIA_HIDDEN, BUTTON_TAG, BTS_PREFERENCES_MODAL_NAME } from '../../utils/constants';
import { addClass, appendChild, getModalFocusableData, debug, fireEvent, createNode, addEvent, setAttribute, addClassPm, getSvgIcon, handleFocusTrap } from '../../utils/general';
import { guiManager } from '../../utils/gui-manager';
import { globalObj } from '../global';

/**
 * Generates custom modal and appends it to "cc-main" el.
 * @param {import("../global").Api} api
 * @param {CreateMainContainer} createMainContainer
 */
export const createBtsModal = (api, createMainContainer) => {
    const state =  globalObj._state;
    const dom = globalObj._dom;

    const {hideBtsPreferences} = api;

    const btsPreferencesModalTitle = 'BTS',
        btsPreferencesModalDescription = 'BTS preferences center';

    if(!dom._jmContainer) {
        dom._jmContainer = createNode(DIV_TAG);
        addClass(dom._jmContainer, 'pm-wrapper');

        const btsOverlay = createNode('div');
        addClass(btsOverlay, 'pm-overlay');
        appendChild(dom._jmContainer, btsOverlay);

        addEvent(btsOverlay, CLICK_EVENT, hideBtsPreferences);

        dom._jm = createNode(DIV_TAG);

        addClass(dom._jm, 'pm');
        setAttribute(dom._jm, 'role', 'dialog');
        setAttribute(dom._jm, ARIA_HIDDEN, true);
        setAttribute(dom._jm, 'aria-modal', true);
        setAttribute(dom._jm, 'aria-labelledby', 'cm__title');

        addEvent(dom._htmlDom, 'keydown', (event) => {
            if (event.keyCode === 27)
                hideBtsPreferences();
        }, true);

        dom._jmHeader = createNode(DIV_TAG);
        addClassPm(dom._jmHeader, 'header');

        dom._jmTitle = createNode('h2');
        addClassPm(dom._jmTitle, 'title');
        dom._jmTitle.id = 'jm__title';

        dom._jmCloseBtn = createNode(BUTTON_TAG);
        addClassPm(dom._jmCloseBtn, 'close-btn');
        setAttribute(dom._jmCloseBtn, 'aria-label', '');
        addEvent(dom._jmCloseBtn, CLICK_EVENT, hideBtsPreferences);

        dom._jmFocusSpan = createNode('span');
        dom._jmFocusSpan.innerHTML = getSvgIcon();
        appendChild(dom._jmCloseBtn, dom._jmFocusSpan);

        appendChild(dom._jmHeader, dom._jmTitle);
        appendChild(dom._jmHeader, dom._jmCloseBtn);

        dom._jmBody = createNode(DIV_TAG);
        addClassPm(dom._jmBody, 'body');
        
        appendChild(dom._jm, dom._jmHeader);
        appendChild(dom._jm, dom._jmBody);

        dom._jmDivTabindex = createNode(DIV_TAG);
        setAttribute(dom._jmDivTabindex, 'tabIndex', -1);
        appendChild(dom._jm, dom._jmDivTabindex);

        appendChild(dom._jmContainer, dom._jm);
    }else {
        dom._mjNewBody = createNode(DIV_TAG);
        addClassPm(dom._jmNewBody, 'body');
    }

    if (btsPreferencesModalTitle) {
        dom._jmTitle.innerHTML = btsPreferencesModalTitle;
    }

    if (btsPreferencesModalDescription) {
        dom._jmBody.innerHTML = btsPreferencesModalDescription;
    }

    if (dom._jmNewBody) {
        dom._jm.replaceChild(dom._jmNewBody, dom._jmBody);
        dom._jmBody = dom._jmNewBody;
    }

    guiManager(2);

    if (!state._btsPreferencesModalExists) {
        state._btsPreferencesModalExists = true;

        debug('CookieConsent [HTML] created', BTS_PREFERENCES_MODAL_NAME);

        fireEvent(globalObj._customEvents._onModalReady, BTS_PREFERENCES_MODAL_NAME, dom._jm);
        createMainContainer(api);
        appendChild(dom._ccMain, dom._jmContainer);
        handleFocusTrap(dom._jm);

        /**
         * Enable transition
         */
        setTimeout(() => addClass(dom._jmContainer, 'cc--anim'), 100);
    }

    getModalFocusableData(3);
};