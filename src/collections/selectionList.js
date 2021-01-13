
import bbx from '../define';

const definition = {
    model: bbx.model.extend({}),
    selectionAttribute: '_selected',
    getSelected() {
    	var o = this.find((m)=>!!m.get(this.selectionAttribute));
    	if(!o) {
    		o = this.get(1);
    	}

    	return o;
    },
    matchSelected(m) {
    	return (m.id===this.getSelected().id);
    },
    setSelected(id) {
        this.map((m) => m.set(this.selectionAttribute, 0));
        const m = this.get(id).set(this.selectionAttribute, 1);

        this.trigger('selection');
        return m;
    },
    setSelectedByUid(uid) {
        this.map((m) => m.set(this.selectionAttribute, 0));
        const m = this.filter((m)=>m.get('uid')===uid)[0].set(this.selectionAttribute, 1);

        this.trigger('selection');
        return m;
    },
    setSelectedBy(a, v) {
        this.map((m) => m.set(this.selectionAttribute, 0));
        const m = this.filter((m)=>m.get(a)+''===v+'')[0].set(this.selectionAttribute, 1);

        this.trigger('selection');
        return m;
    },
    setModelSelected(m) {
        this.setSelected(m.id);

        this.trigger('selection');
        return m;
    },
};

export { definition };
export default bbx.collection.extend(definition);