import Mock from 'mockjs';
import { doCustomTimes } from '@/libs/util';
const Random = Mock.Random;

export const getTableData = req => {
    let tableData = [];
    doCustomTimes(5, () => {
        tableData.push(Mock.mock({
            name: '@name',
            email: '@email',
            createTime: '@date'
        }));
    });
    return tableData;
};

export const getDragList = req => {
    let dragList = [];
    doCustomTimes(5, () => {
        dragList.push(Mock.mock({
            name: Random.csentence(10, 13),
            id: Random.increment(10)
        }));
    });
    return dragList;
};

export const uploadImage = req => {
    return Promise.resolve();
};


export const getTableTree = () => {
    return {
        code:0,
        'data|10-20': [
            {
                'id|1-100': 1,
                'title': /^[A-Za-z]{2,6}$/,
                'groupName': '@cname()',
                'nickname': '@cname()',
                'type|1-4': 1,
                'note':1,
                'childNodeNum|1-4':1,
                'imeiNum|1-4':1,
                'userNum|1-4':1,
            },
        ],
        msg: 'ok',
    };
};

export const getLoadTree = ()=> {
    return {
        conde:0,
        'data|5-10':[
            {
                'id|1-100':1,
                'title':Random.csentence(3, 5),
                'isSub|1-2':true
            }
        ],
        msg:'ok'
    };
};
