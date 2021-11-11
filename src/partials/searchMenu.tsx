


export function SearchMenu() {
    return <div class="d-none" id="search-menu">
        <h1>Search results</h1>
        <div class="row" style="margin-top: 20px;margin-bottom: 20px">
            <div class="col-md-4">
                <p class="mini-header">Types</p>
                <div>
                    <input type="checkbox" class="c-checkbox" id="search-option-classes" checked />
                    <span>Classes</span>
                </div>
                <div>
                    <input type="checkbox" class="c-checkbox" id="search-option-interfaces" checked />
                    <span>Interfaces</span>
                </div>
                <div>
                    <input type="checkbox" class="c-checkbox" id="search-option-enums" checked />
                    <span>Enums</span>
                </div>
                <div>
                    <input type="checkbox" class="c-checkbox" id="search-option-functions" checked />
                    <span>Functions</span>
                </div>
                <div>
                    <input type="checkbox" class="c-checkbox" id="search-option-types" checked />
                    <span>Type aliases</span>
                </div>
                <div>
                    <input type="checkbox" class="c-checkbox" id="search-option-constants" />
                    <span>Constants</span>
                </div>
            </div>
            <div class="col-md-4">
                <p class="mini-header">Members</p>
                <div>
                    <div>
                        <input type="checkbox" class="c-checkbox" id="search-option-properties" checked />
                        <span>Properties</span>
                    </div>
                    <div>
                        <input type="checkbox" class="c-checkbox" id="search-option-methods" checked />
                        <span>Methods</span>
                    </div>
                    <div>
                        <input type="checkbox" class="c-checkbox" id="search-option-getters" checked />
                        <span>Getters</span>
                    </div>
                    <div>
                        <input type="checkbox" class="c-checkbox" id="search-option-setters" checked />
                        <span>Setters</span>
                    </div>
                    <div>
                        <input type="checkbox" class="c-checkbox" id="search-option-enum-members" />
                        <span>Enum members</span>
                    </div>
                    <div>
                        <input type="checkbox" class="c-checkbox" id="search-option-privates" />
                        <span>Show privates</span>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <p class="mini-header">Other</p>
                <div>
                    <div>
                        <input type="checkbox" class="c-checkbox" id="search-option-this-module-only" />
                        <span>In this module only</span>
                    </div>
                </div>
            </div>
        </div>

        <div id="search-result-list" />
    </div>
}