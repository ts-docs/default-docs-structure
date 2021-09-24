"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSearch = void 0;
var fuzzysort_1 = require("fuzzysort");
function hasBit(bits, bit) {
    return (bits & bit) === bit;
}
var searchTerm = "";
var searchData = [];
var searchResults;
function initSearch(search, contentMain, searchMenu) {
    return __awaiter(this, void 0, void 0, function () {
        var searchBar, options_1, val, timeout_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    searchBar = document.getElementById("search");
                    if (!searchBar) return [3, 5];
                    window.onkeypress = function () {
                        searchBar.focus();
                    };
                    options_1 = getSearchOptions();
                    window.onpopstate = function (event) {
                        if (event.state && event.state.search) {
                            contentMain.classList.add("d-none");
                            searchMenu.classList.remove("d-none");
                            evaluateSearch(event.state.search, options_1);
                        }
                        else {
                            contentMain.classList.remove("d-none");
                            searchMenu.classList.add("d-none");
                        }
                    };
                    if (!search.has("search")) return [3, 2];
                    val = search.get("search");
                    searchBar.value = val;
                    return [4, loadSearchData()];
                case 1:
                    _a.sent();
                    evaluateSearch(val, options_1);
                    return [3, 4];
                case 2: return [4, loadSearchData()];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    searchBar.oninput = function (ev) { return __awaiter(_this, void 0, void 0, function () {
                        var target, searchTerm;
                        var _this = this;
                        return __generator(this, function (_a) {
                            target = ev.target;
                            searchTerm = target.value.trim();
                            if (!searchTerm.length) {
                                clearTimeout(timeout_1);
                                searchMenu.classList.add("d-none");
                                contentMain.classList.remove("d-none");
                                return [2];
                            }
                            if (timeout_1)
                                clearTimeout(timeout_1);
                            timeout_1 = setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            history.pushState({ search: searchTerm }, "", "?search=" + searchTerm);
                                            return [4, evaluateSearch(searchTerm, options_1)];
                                        case 1:
                                            _a.sent();
                                            contentMain.classList.add("d-none");
                                            searchMenu.classList.remove("d-none");
                                            return [2];
                                    }
                                });
                            }); }, 400);
                            return [2];
                        });
                    }); };
                    _a.label = 5;
                case 5: return [2];
            }
        });
    });
}
exports.initSearch = initSearch;
function search(term, filteredResults) {
    if (!searchData)
        return [];
    if (term.includes(".")) {
        return fuzzysort_1.go(term, filteredResults.map(function (r) { return (__assign(__assign({}, r), { oldName: r.name, name: (r.obj || "") + "." + r.name })); }), { key: "name", allowTypo: true, limit: 150, threshold: -5000 }).map(function (item) {
            item.obj.highlighted = item.obj.oldName;
            item.obj.name = item.obj.oldName;
            return item.obj;
        });
    }
    else {
        return fuzzysort_1.go(term, filteredResults, { key: "name", allowTypo: true, limit: 150, threshold: -5000 }).map(function (item) {
            item.obj.highlighted = fuzzysort_1.highlight(item, '<span style="border-bottom: dotted 2px var(--primaryLight)">', "</span>");
            return item.obj;
        });
    }
}
function evaluateSearch(term, options) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!searchData)
                return [2];
            searchTerm = term;
            searchResults = search(term, filterResults(options, searchData));
            displayResults(searchResults);
            return [2];
        });
    });
}
function filterResults(options, data) {
    var e_1, _a;
    var newRes = [];
    try {
        for (var data_1 = __values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
            var res = data_1_1.value;
            if (options.thisModuleOnly.checked && window.lm && res.path[0] !== window.lm)
                continue;
            if (!options.privates.checked && res.isPrivate)
                continue;
            if (!options.classes.checked && res.type === 0)
                continue;
            if (!options.interfaces.checked && res.type === 1)
                continue;
            if (!options.enums.checked && res.type === 2)
                continue;
            if (!options.functions.checked && res.type === 3)
                continue;
            if (!options.types.checked && res.type === 5)
                continue;
            if (!options.constants.checked && res.type === 4)
                continue;
            if (!options.properties.checked && (res.type === 6 || res.type === 7))
                continue;
            if (res.type === 8) {
                if (!options.methods.checked)
                    continue;
                if (!options.setters.checked && res.isSetter)
                    continue;
                if (!options.getters.checked && res.isGetter)
                    continue;
            }
            if (!options.enumMembers.checked && res.type === 9)
                continue;
            newRes.push(res);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (data_1_1 && !data_1_1.done && (_a = data_1.return)) _a.call(data_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return newRes;
}
function getSearchOptions() {
    var options = {
        classes: document.getElementById("search-option-classes"),
        interfaces: document.getElementById("search-option-interfaces"),
        enums: document.getElementById("search-option-enums"),
        functions: document.getElementById("search-option-functions"),
        constants: document.getElementById("search-option-constants"),
        types: document.getElementById("search-option-types"),
        properties: document.getElementById("search-option-properties"),
        methods: document.getElementById("search-option-methods"),
        enumMembers: document.getElementById("search-option-enum-members"),
        thisModuleOnly: document.getElementById("search-option-this-module-only"),
        setters: document.getElementById("search-option-setters"),
        getters: document.getElementById("search-option-getters"),
        privates: document.getElementById("search-option-privates")
    };
    options.classes.onchange =
        options.interfaces.onchange =
            options.enums.onchange =
                options.functions.onchange =
                    options.constants.onchange =
                        options.types.onchange =
                            options.properties.onchange =
                                options.methods.onchange =
                                    options.enumMembers.onchange =
                                        options.setters.onchange =
                                            options.getters.onchange =
                                                options.privates.onchange =
                                                    options.thisModuleOnly.onchange = function () { return evaluateSearch(searchTerm, options); };
    return options;
}
function formatResult(res) {
    var path = res.path.slice();
    var content = "";
    switch (res.type) {
        case 0: {
            content = "<div>\n            <span class=\"keyword\">class</span>\n            <a href=\"" + window.depth + path.map(function (m) { return "m." + m; }).join("/") + "/class/" + res.name + ".html\" class=\"item-name object\">" + res.highlighted + "<a>\n            " + (path.length ? "<p class=\"docblock secondary\">In " + path.join("/") + "</p>" : "") + "\n            </div>";
            break;
        }
        case 1: {
            content = "<div>\n            <span class=\"keyword\">interface</span>\n            <a href=\"" + window.depth + path.map(function (m) { return "m." + m; }).join("/") + "/interface/" + res.name + ".html\" class=\"item-name object\">" + res.highlighted + "<a>\n            " + (path.length ? "<p class=\"docblock secondary\">In " + path.join("/") + "</p>" : "") + "\n            </div>";
            break;
        }
        case 2: {
            content = "<div>\n            <span class=\"keyword\">enum</span>\n            <a href=\"" + window.depth + path.map(function (m) { return "m." + m; }).join("/") + "/enum/" + res.name + ".html\" class=\"item-name object\">" + res.highlighted + "<a>\n            " + (path.length ? "<p class=\"docblock secondary\">In " + path.join("/") + "</p>" : "") + "\n            </div>";
            break;
        }
        case 3: {
            content = "<div>\n            <span class=\"keyword\">function</span>\n            <a href=\"" + window.depth + path.map(function (m) { return "m." + m; }).join("/") + "/function/" + res.name + ".html\" class=\"item-name method-name\">" + res.highlighted + "<a>\n            " + (path.length ? "<p class=\"docblock secondary\">In " + path.join("/") + "</p>" : "") + "\n            </div>";
            break;
        }
        case 5: {
            content = "<div>\n            <span class=\"keyword\">type</span>\n            <a href=\"" + window.depth + path.map(function (m) { return "m." + m; }).join("/") + "/type/" + res.name + ".html\" class=\"item-name object\">" + res.highlighted + "<a>\n            " + (path.length ? "<p class=\"docblock secondary\">In " + path.join("/") + "</p>" : "") + "\n            </div>";
            break;
        }
        case 4: {
            content = "<div>\n            <span class=\"keyword\">const</span>\n            <a href=\"" + window.depth + path.map(function (m) { return "m." + m; }).join("/") + "/constant/" + res.name + ".html\" class=\"item-name object\">" + res.highlighted + "<a>\n            " + (path.length ? "<p class=\"docblock secondary\">In " + path.join("/") + "</p>" : "") + "\n            </div>";
            break;
        }
        case 6: {
            content = "<div>\n            <a href=\"" + window.depth + path.map(function (m) { return "m." + m; }).join("/") + "/class/" + res.obj + ".html#." + res.name + "\"><span class=\"item-name object\">" + res.obj + "</span><span class=\"symbol\">.</span><span class=\"item-name property-name\">" + res.highlighted + "</span></a>\n            " + (path.length ? "<p class=\"docblock secondary\">In " + path.join("/") + "</p>" : "") + "\n            </div>";
            break;
        }
        case 8: {
            content = "<div>\n            <a href=\"" + window.depth + path.map(function (m) { return "m." + m; }).join("/") + "/class/" + res.obj + ".html#." + res.name + "\">" + (res.isGetter ? '<span class="keyword">getter</span> ' : "") + (res.isSetter ? '<span class="keyword">setter</span> ' : "") + "<span class=\"item-name object\">" + res.obj + "</span><span class=\"symbol\">.</span><span class=\"item-name method-name\">" + res.highlighted + "</span></a>\n            " + (path.length ? "<p class=\"docblock secondary\">In " + path.join("/") + "</p>" : "") + "\n            </div>";
            break;
        }
        case 7: {
            content = "<div>\n            <a href=\"" + window.depth + path.map(function (m) { return "m." + m; }).join("/") + "/interface/" + res.obj + ".html#." + res.name + "\" class=\"item-name property-name\"><span class=\"item-name object\">" + res.obj + "</span><span class=\"symbol\">.</span><span class=\"item-name property-name\">" + res.highlighted + "</span></a>\n            " + (path.length ? "<p class=\"docblock secondary\">In " + path.join("/") + "</p>" : "") + "\n            </div>";
            break;
        }
        case 9: {
            content = "<div>\n            <a href=\"" + window.depth + path.map(function (m) { return "m." + m; }).join("/") + "/enum/" + res.obj + ".html#." + res.name + "\"><span class=\"item-name object\">" + res.obj + "</span><span class=\"symbol\">.</span><span class=\"item-name item-name\">" + res.highlighted + "</span></a>\n            " + (path.length ? "<p class=\"docblock secondary\">In " + path.join("/") + "</p>" : "") + "\n            </div>";
            break;
        }
    }
    return "<div class=\"search-result\">" + content + "</div>";
}
function displayResults(results) {
    var searchResults = document.getElementById("search-result-list");
    if (!results.length) {
        searchResults.innerHTML = "<h1 class=\"text-center\">No results!</h1>";
        return;
    }
    if (results.length === 1) {
        searchResults.innerHTML = "\n         <div>\n         " + results.map(function (h) { return formatResult(h); }).join("") + "\n         </div>\n        ";
    }
    else {
        var mid = Math.ceil(results.length / 2);
        searchResults.innerHTML = "\n    <div class=\"row\">\n    <div class=\"col-lg-6\">\n    " + results.slice(0, mid).map(function (h) { return formatResult(h); }).join("") + "\n    </div>\n    <div class=\"col-lg-6\">\n    " + results.slice(-mid).map(function (h) { return formatResult(h); }).join("") + "\n    </div>\n    </div>\n    ";
    }
}
function loadSearchData() {
    return __awaiter(this, void 0, void 0, function () {
        var req, data, moduleNames, _a, _b, module_1;
        var e_2, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4, fetch(window.depth + "assets/search.json", {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    })];
                case 1:
                    req = _d.sent();
                    return [4, req.json()];
                case 2:
                    data = _d.sent();
                    moduleNames = data[1];
                    try {
                        for (_a = __values(data[0]), _b = _a.next(); !_b.done; _b = _a.next()) {
                            module_1 = _b.value;
                            searchData.push.apply(searchData, __spreadArray([], __read(module_1[1].map(function (cl) {
                                var path = cl[3].map(function (p) { return moduleNames[p]; });
                                searchData.push.apply(searchData, __spreadArray([], __read(cl[1].map(function (_a) {
                                    var _b = __read(_a, 2), name = _b[0], bits = _b[1];
                                    return ({ name: name, path: path, obj: cl[0], type: 6, isPrivate: hasBit(bits, 4) });
                                }))));
                                searchData.push.apply(searchData, __spreadArray([], __read(cl[2].map(function (_a) {
                                    var _b = __read(_a, 2), name = _b[0], bits = _b[1];
                                    return ({ name: name, path: path, obj: cl[0], type: 8, isGetter: hasBit(bits, 1), isSetter: hasBit(bits, 2), isPrivate: hasBit(bits, 4) });
                                }))));
                                return {
                                    name: cl[0],
                                    path: path,
                                    type: 0
                                };
                            }))));
                            searchData.push.apply(searchData, __spreadArray([], __read(module_1[2].map(function (inter) {
                                var path = inter[2].map(function (p) { return moduleNames[p]; });
                                searchData.push.apply(searchData, __spreadArray([], __read(inter[1].map(function (p) { return ({ name: p, path: path, obj: inter[0], type: 7 }); }))));
                                return {
                                    name: inter[0],
                                    path: path,
                                    type: 1
                                };
                            }))));
                            searchData.push.apply(searchData, __spreadArray([], __read(module_1[3].map(function (en) {
                                var path = en[2].map(function (p) { return moduleNames[p]; });
                                searchData.push.apply(searchData, __spreadArray([], __read(en[1].map(function (p) { return ({ name: p, path: path, obj: en[0], type: 9 }); }))));
                                return {
                                    name: en[0],
                                    path: path,
                                    type: 2
                                };
                            }))));
                            searchData.push.apply(searchData, __spreadArray([], __read(module_1[4].map(function (t) { return ({ name: t[0], path: t[1].map(function (p) { return moduleNames[p]; }), type: 5 }); }))));
                            searchData.push.apply(searchData, __spreadArray([], __read(module_1[5].map(function (t) { return ({ name: t[0], path: t[1].map(function (p) { return moduleNames[p]; }), type: 3 }); }))));
                            searchData.push.apply(searchData, __spreadArray([], __read(module_1[6].map(function (t) { return ({ name: t[0], path: t[1].map(function (p) { return moduleNames[p]; }), type: 4 }); }))));
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                    return [2];
            }
        });
    });
}
