"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
var search_1 = require("./search");
var sidebar_1 = require("./sidebar");
var theme_1 = require("./theme");
theme_1.initTheme();
window.addEventListener("load", function () {
    var e_1, _a, e_2, _b;
    var _loop_1 = function (el) {
        el.onclick = function () {
            var _a;
            var body = (_a = el.parentElement) === null || _a === void 0 ? void 0 : _a.getElementsByClassName("collapsible-body")[0];
            if (!body)
                return;
            body.classList.toggle("open");
            var arrow = el.getElementsByClassName("collapsible-arrow")[0];
            if (arrow)
                arrow.classList.toggle("open");
        };
    };
    try {
        for (var _c = __values(document.getElementsByClassName("collapsible-trigger")), _d = _c.next(); !_d.done; _d = _c.next()) {
            var el = _d.value;
            _loop_1(el);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
        }
        finally { if (e_1) throw e_1.error; }
    }
    var _loop_2 = function (tooltip) {
        var timeout;
        var tooltipContent = tooltip.getElementsByClassName("c-tooltip-content")[0];
        if (!tooltipContent || tooltipContent.classList.contains("open"))
            return { value: void 0 };
        tooltip.onmouseover = function () {
            if (timeout)
                clearTimeout(timeout);
            timeout = setTimeout(function () {
                tooltipContent.classList.add("open");
            }, 600);
        };
        tooltip.onmouseleave = function () {
            clearTimeout(timeout);
            tooltipContent.classList.remove("open");
        };
    };
    try {
        for (var _e = __values(document.getElementsByClassName("c-tooltip")), _f = _e.next(); !_f.done; _f = _e.next()) {
            var tooltip = _f.value;
            var state_1 = _loop_2(tooltip);
            if (typeof state_1 === "object")
                return state_1.value;
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
        }
        finally { if (e_2) throw e_2.error; }
    }
    var contentMain = document.getElementById("content-main");
    var searchMenu = document.getElementById("search-menu");
    var searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("search"))
        searchMenu.classList.remove("d-none");
    else
        contentMain.classList.remove("d-none");
    search_1.initSearch(searchParams, contentMain, searchMenu);
    var scrollToTopBtn = document.getElementById("to-top");
    var content = document.getElementById("content");
    content.addEventListener("scroll", function () {
        if (content.scrollTop > 600 || content.scrollTop > 600) {
            scrollToTopBtn.style.display = "block";
        }
        else {
            scrollToTopBtn.style.display = "none";
        }
    });
    scrollToTopBtn.onclick = function () { return content.scroll({ top: 0, behavior: "smooth" }); };
    sidebar_1.initSidebar(contentMain);
});
