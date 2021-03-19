import bbx from "../define";

const definition = {
    model: bbx.model.extend({}),
    selectionAttribute: "_selected",
    defaultSelection: null, // ['attribute', 'value']
    getSelected() {
        var o = this.find((m) => !!m.get(this.selectionAttribute));
        if (!o) {
            if (this.defaultSelection) {
                var [a, v] = this.defaultSelection;
                var m = this.setSelectedBy(a, v, { silent: true });
                if (m) {
                    return m;
                }
            }
            o = this.get(1);
        }

        return o;
    },
    matchSelected(m) {
        return m.id === this.getSelected().id;
    },
    setSelected(id, o = {}) {
        this.map((m) => m.set(this.selectionAttribute, 0));
        const m = this.get(id);

        this.setModelSelected(m, o);
        return m;
    },
    setSelectedByUid(uid, o = {}) {
        this.map((m) => m.set(this.selectionAttribute, 0));
        const m = this.filter((m) => m.get("uid") === uid)[0];

        this.setModelSelected(m, o);
        return m;
    },
    setSelectedBy(a, v, o = {}) {
        this.map((m) => m.set(this.selectionAttribute, 0));
        const m = this.filter((m) => m.get(a) + "" === v + "")[0];

        this.setModelSelected(m, o);
        return m;
    },
    setModelSelected(m, o = {}) {
        if (!m) {
            this.trigger("selection-notfound");
            return m;
        }
        this.setSelected(m.id);

        if (!o.silent) this.trigger("selection");
        return m;
    },
};

export { definition };
export default bbx.collection.extend(definition);
