/**
 * 部门管理API
 */
import * as API from '@/api/API'

let Department = {};

// 获取部门列表
Department.list = function(queryParams) {
    const data=encodeURI(queryParams);
    return API.GET('_auth:/department?'+ data).then(response => {
        if (response.status == 200) {
            
            return response.result;
        }
        return null;
    }).catch(error => {
        return null;
    })
};

// 查询权限
Department.search = function(menuQueryParams, queryPagingParams) {
    const data=encodeURI(menuQueryParams+queryPagingParams);
    return API.GET('_auth:/department/tree?'+data).then(response => {
        if (response.status == 200) {
            return response.result;
        }
        return null;
    }).catch(error => {
        return null;
    })
}

// 添加部门
Department.add = function(menuParameters) {
    return API.PATCH('_auth:/department', menuParameters).then(response => {
        if (response.status == 200) {
            return response.result;
        }
        return false;
    }).catch(error => {
        return false;
    })
};

// 删除部门
Department.delete = function(id) {
    return API.DELETE(`_auth:/department/${id}`).then(response => {
        if (response.status == 200) {
            return response;
        }
    }).catch(error => {
        return false;
    })
}


// 获取获取用户所在部门列表
Department.listByUserId = function(id) {
    return API.GET('_auth:/department/listByUserId?userId='+id).then(response => {
        if (response.status == 200) {
            return response.result;
        }
        return null;
    }).catch(error => {
        return null;
    })
};
// 获取获取用户所在部门(包含下级部门)
Department.listContainChildren = function(id) {
    return API.GET('_auth:/department/listContainChildren?userId='+id).then(response => {
        if (response.status == 200) {
            return response.result;
        }
        return null;
    }).catch(error => {
        return null;
    })
};
// 获取所有部门（带用户id的，具体找后端问是怎么个东西）
Department.allList = function(id) {
    return API.GET('_auth:/department/list?userId='+id).then(response => {
        if (response.status == 200) {
            return response.result;
        }
        return null;
    }).catch(error => {
        return null;
    })
};


export default Department;