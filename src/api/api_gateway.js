import ApiConfig from '@/api/platform_api'
import DSLParameterBuilder from '@/api/dsl_builder'

let createGateway = function (apiConfig) {
  var Token = null;
  var Gateway = function () {};

  var util = {
    ajax: function (url, method, payload) {
      // 兼容IE浏览器
      var request;
      if (window.XMLHttpRequest) {
        request = new XMLHttpRequest();
      } else {
        request = new ActiveXObject("Microsoft.XMLHTTP");
      }

      return new Promise(function (resolve, reject) {
        request.onreadystatechange = function () {
          if (request.readyState === 4) {
            if (request.status === 200 || request.status == 201) {
              if (typeof request.response === 'string') {
                resolve(JSON.parse(request.response));
              } else {
                resolve(request.response);
              }
              // resolve(request.response);
            } else {
              reject(request.response);
              if (request.status == 401 || request.status == 403) {
                window.$vm.$router.push({
                  name: 'login'
                });
              }
            }
          }
        };

        if (method.toUpperCase() === 'GET') {
          var arr = [];
          for (var key in payload) {
            arr.push(key + '=' + payload[key]);
          }
          // GET请求强制加上时间戳
          var t = Math.floor((new Date()).valueOf() / 1000 / 60);
          arr.push('_t=' + t);

          var getData = encodeURI(arr.join('&'));
          request.open('GET', url + "?" + getData, true);
          request.setRequestHeader("Authorization", Token);
          request.send(null);
        } else if (method.toUpperCase() === 'POST') {
          request.open('POST', url, true);
          request.responseType = "json";
          request.setRequestHeader("Authorization", Token);
          request.setRequestHeader("Content-Type", "application/json;charset=utf-8");
          request.withCredentials = true;
          request.send(JSON.stringify(payload));
        } else if (method.toUpperCase() === 'PUT') {
          request.open('PUT', url, true);
          request.responseType = 'json';
          request.setRequestHeader("Authorization", Token);
          request.setRequestHeader("Content-Type", "application/json;charset=utf-8");
          request.withCredentials = true;
          request.send(JSON.stringify(payload));
        } else if (method.toUpperCase() === 'PATCH') {
          request.open('PATCH', url, true);
          request.responseType = 'json';
          request.setRequestHeader("Authorization", Token);
          request.setRequestHeader("Content-Type", "application/json;charset=utf-8");
          request.withCredentials = true;
          request.send(JSON.stringify(payload));
        } else if (method.toUpperCase() === 'DELETE') {
          request.open('DELETE', url, true);
          request.responseType = 'json';
          request.setRequestHeader("Authorization", Token);
          request.setRequestHeader("Content-Type", "application/json;charset=utf-8");
          request.withCredentials = true;
          request.send(JSON.stringify(payload));
        } else {
          var err = "{0} method is not supportted".format(method);
          console.error(err);
          throw err;
        }
      })
    },

    submit: function (url, method, payload) {
      var request;
      if (window.XMLHttpRequest) {
        request = window.XMLHttpRequest;
      } else {
        request = new ActiveXObject('Microsoft.XMLHTTP');
      }
      request.withCredentials = true;

      return new Promise(function (resolve, reject) {
        request.onreadystatechange = function () {
          if (request.readyState === 4) {
            if (request.status === 200) {
              resolve(JSON.parse(request.response));
            } else {
              reject(request.status);
            }
          }
        };

        request.open(method, url, true);
        request.setRequestHeader('Authorization', Token);
        request.setRequestHeader('Content-Type', 'application/x-www-urlencoded;charset=utf-8');
        request.send(payload);
      })
    },

    render: function (tpl, data) {
      var re = /{{([^}]+)?}}/;
      var match = '';

      while (match = re.exec(tpl)) {
        tpl = tpl.replace(match[0], data[match[1]]);
      }
      return tpl;
    }
  };

  let fire = function (pathParam, payload) {
    this.method = this.method.toUpperCase();
    var url = util.render(this.path, pathParam);
  
    return util.ajax(url, this.method, payload);
  };

  let submit = function (pathParam, payload) {
    this.method = this.method.toUpperCase();
    var url = util.render(this.path, pathParam);
    return util.ajax(url, this.method, payload);
  };

  let createQuery = function () {
    const me = this;
    me.method = 'get';
    var builder = new DSLParameterBuilder();

    builder.orderByDesc = function (f) {
      builder.sorts.push({ "name": f, "order": "desc" });
      return builder;
    };

    builder.orderBy = function (f) {
      builder.sorts.push({ "name": f, "order": "asc" });
      return builder;
    };

    builder.orderByAsc = function (f) {
      builder.sorts.push({ "name": f, "order": "asc" });
      return builder;
    };

    builder.noPaging = function () {
      builder.param.paging = "false";
      return builder;
    };

    builder.limit = function (pageIndex, pageSize) {
      builder.param.pageIndex = pageIndex;
      if (pageSize) {
        builder.param.pageSize = pageSize;
      }
      return builder;
    };

    builder.fire = function (o) {
      me.method = me.method.toUpperCase();
      me.path = util.render(me.path, builder.getParam)
      for (var f in o) {
        builder.param[f] = o[f];
      }
     
      return util.ajax(me.path, me.method, builder.getParams());
    };

    return builder;
  };

  let createInsert = function (model) {
    const me = this;
    var operate = new function () {};
    operate.fire = function () {
   
      return util.ajax(me.path, 'POST', model);
    }
    return operate;
  };

  let createDelete = function (id) {
    const me = this;
    var operate = new function () {};
    operate.fire = function () {
      var path = me.path + '/{0}'.format(id);
     
      return util.ajax(path, 'DELETE', {});
    };
    return operate;
  };

  let createUpdate = function (id, model) {
    const me = this;
    var operate = new function () {};
    operate.fire = function () {
      var path = me.path + '/' + id;
     
      return util.ajax(path, 'PUT', model);
    }
    return operate;
  };

  let createPatch = function (model) {
    const me = this;
    var operate = new function () {};
    operate.fire = function () {
    
      return util.ajax(me.path, 'PATCH', model);
    }
    return operate;
  }

  Gateway.prototype.useToken = function (token) {
    Token = token;
  };

  for (var i = 0; i < apiConfig.pathList.length; i++) {
    Gateway.prototype[apiConfig.pathList[i].name] = {
      path: apiConfig.BasePath + apiConfig.pathList[i].path,
      method: apiConfig.pathList[i].method,
      fire: fire,
      submit: submit,
      createQuery: createQuery,
      createInsert: createInsert,
      createDelete: createDelete,
      createUpdate: createUpdate,
      createPatch: createPatch,
    }
  };

  return new Gateway();
}

export default {
  install(Vue) {
    Object.defineProperty(Vue.prototype, "$api", { value: createGateway(ApiConfig) });
  }
}