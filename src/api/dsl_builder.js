function DSLParameterBuilder() {
    var me = this;
    me.param = {};
    me.terms = [];
    me.sorts = [];
    me.nowType = "and";
    
    function buildSort(sorts) {
        var tmp = {};
        sorts.forEach(function(item, index) {
            for (var f in item) {
                if (f !== 'sorts') {
                    tmp["sorts[" + i + "]." + f] = e[f];
                } else {
                    var tmpTerms = buildSort(e[f]);
                    for (var f2 in tmpTerms) {
                        tmp["sorts[" + index + "]." + f2] = tmpTerms[f2];
                    }
                }
            }
        });
        return tmp;
    }
    
    function bindOperate(operate) {
        function accept(k, t, v) {
            operate.terms.push({ column: k, type: operate.nowType, termType: t, value: v });
            return operate;
        }
        
        var mapping = ["gt", "gte", "lt", "lte", "like", "nlike", "in", "is", "eq", "not"];
        
        mapping.forEach(function(item, index) {
            var type = item + "";
            operate[type] = function(k,v) {
                return accept(k, type, v);
            }
        });
        
        var mapping2 = ["isnull", "notnull", "empty", "nempty"];
        mapping2.forEach(function(item, index) {
            var type = item + "";
            operate[type] = function(k) {
                return accept(k, type, "1");
            }
        });
        
        operate.btw = operate.between = function(column, between, and) {
            return accept(column, "btw", between + "," + and);
        };
        
        operate.nbtw = operate.notBetween = function(column, between, and) {
            return accept(column, "nbtw", between + "," + and);
        };
    };
    
    bindOperate(me);
    me.getParams = function() {
        var tmp = me.buildParam(me.terms);
        var sorts = buildSort(me.sorts);
        for (var f in tmp) {
            me.param[f] = tmp[f];
        };
        for (var f in sorts) {
            me.param[f] = sorts[f];
        }
        return me.param;
    };
    
    me.includes = function(columns) {
        me.param.includes = columns + "";
        return me;
    };
    
    me.excludes = function(columns) {
        me.param.excludes = columns + "";
        return me;
    };
    
    me.where = function(k, v, t) {
        me.and(k, v, t);
        return me;
    };
    
    me.and = function(k, v, t) {
        me.nowType = "and";
        if (k && v) {
            me.terms.push({ column: k, termType: t, type: me.nowType, value: v });
        }
        return me;
    };
    
    me.orNest = function() {
        return me.nest(true, me);
    };
    
    me.nest = function(isOr, parent) {
        var nest = { type: isOr ? 'or' : 'and' };
        if (!parent) parent = me;
        
        parent.terms.push(nest);
        nest.terms = [];
        var fun = { terms: nest.terms, nowType: isOr ? 'or' : 'and' };
        
        bindOperate(fun);
        fun.and = function(k, v, t) {
            fun.nowType = 'and';
            if (k && v) {
                fun.terms.push({ column: k, termType: t, value: v, type: 'and' });
            }
            return fun;
        };
        
        fun.or = function(k, v, t) {
            fun.nowType = 'or';
            if (k && v) {
                nest.terms.push({ column: k, termType: t, value: v, type: 'or' });
            }
            return fun;
        };
        
        fun.exec = me.exec;
        fun.orNest = function() {
            return me.orNest();
        };
        fun.nest = function() {
            return me.nest(false, nest);
        };
        fun.end = function() {
            return parent;
        };
        return fun;
    };
    
    me.or = function(k, v, t) {
        me.nowType = 'or';
        if (k && v) {
            me.terms.push({ column: k, termType: t, value: v, type: me.nowType });
        }
        return me;
    };
    
    me.buildParam = function(terms) {
        var tmp = {};
        terms.forEach(function(item, index) {
            for (var f in item) {
                if (f !== 'terms') {
                    tmp["terms[" + index + "]." + f] = item[f];
                } else {
                    var tmpTerms = me.buildParam(item[f]);
                    for (var f2 in tmpTerms) {
                        tmp["terms[" + index +"]." + f2] = tmpTerms[f2];
                    }
                }
            }
        });
        return tmp;
    };
    
    return me;
}

export default DSLParameterBuilder;
