/**
 * 通用查询查询解析器
 */
export function encodeQueryParam(data) {
    let queryParam = '';
    let index = 0;
    for (let f in data) {
        if (data[f] === '' || data[f].temp==='') continue;
    	let temp='';
        if(data[f].type==='and'){
	        temp=data[f].temp;
        	if (f.indexOf('$LIKE') !== -1 && data[f].temp.indexOf('%') === -1) temp = '%' + data[f].temp + '%';
	        if (f.indexOf('$START') !== -1) temp = '%' + data[f].temp;
	        if (f.indexOf('$END') !== -1) temp = data[f].temp + '%';
	        queryParam+=`terms[${index}].column=${f}&terms[${index}].value=${temp}&terms[${index}].type=and&`;
        }else{
	        temp=data[f];
        	if (f.indexOf('$LIKE') !== -1 && data[f].indexOf('%') === -1) temp = '%' + data[f] + '%';
	        if (f.indexOf('$START') !== -1) temp = '%' + data[f];
	        if (f.indexOf('$END') !== -1) temp = data[f] + '%';
	        queryParam+=`terms[${index}].column=${f}&terms[${index}].value=${temp}&terms[${index}].type=or&`;
        }
        
        temp = '';
        index++;
    }
    return queryParam;
}

export function encodePagingQueryParam(data) {
    let queryParam = '';
    for (let f in data) {
        if (data[f] === '') continue;
        queryParam+=`${f}=${data[f]}&`
    }
    return queryParam;
}

export function queryParam(data) {
    let queryParam = {};
    let terms = {
        0: {column: 'name', type: 'and', termType: 'like', value: ''},
        1: {column: 'permissionId', type: 'or', termType: 'like', value: ''},
        2: {column: 'url', type: 'or', termType: 'like', value: ''}
    }

    for (let index in terms) {
        terms[index].value = '%' + data + '%';
        queryParam['terms[' + (index) + '].column'] = terms[index].column;
        queryParam['terms[' + (index) + '].type'] = terms[index].type;
        queryParam['terms[' + (index) + '].termType'] = terms[index].termType;
        queryParam['terms[' + (index) + '].value'] = terms[index].value;
    }
    return queryParam;
}