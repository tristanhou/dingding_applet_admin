import axios from '@/libs/api.request';
import qs from 'qs';

export const getTableData = (url, data) => {
    return axios.request({
      url: url,
      method: 'get',
      params: data
    })
  }

export const getDragList = () => {
    return axios.request({
        url: 'get_drag_list',
        method: 'get'
    });
};

export const errorReq = () => {
    return axios.request({
        url: 'error_url',
        method: 'post'
    });
};
export const changeData = (url, data) => {
    return axios.request({
      url: url,
      method: 'post',
      data: qs.stringify(data)
    })
}

export const saveErrorLogger = info => {
    return axios.request({
        url: 'save_error_logger',
        data: info,
        method: 'post'
    });
};

export const uploadImg = formData => {
    return axios.request({
        url: 'image/upload',
        data: formData
    });
};

export const getData = (url, data) => {
    return axios.request({
        url: url,
        method: 'get',
        params: data
    });
};

export const getPostData = (url, data) => {
    return axios.request({
        url: url,
        method: 'post',
        data: qs.stringify(data)
    });
};