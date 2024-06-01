import {makeAutoObservable} from "mobx";

export default class FilterOptionsStore {
    constructor() {
        this._options = {
            sortBy: "articleRating",
            order: true,
            selectedConfs: [],
            searchInput: "",
            centralityFilter: 0,
            authorFilter: 0,
            year: (new Date()).getFullYear(),
            yearState: (new Date()).getFullYear()
        }
        makeAutoObservable(this)
    }

    setOptions(options) {
        this._options = options
    }

    get options() {
        return this._options
    }

}