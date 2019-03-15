const btns = {
  delete: (h, params, vm) => {
    return h('Poptip', {
      props: {
        confirm: true,
        title: '你确定要删除吗?'
      },
      style: {
        textAlign: 'left'
      },
      on: {
        'on-ok': () => {
          // vm.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex))
          vm.$emit('on-delete', params)
        }
      }
    }, [
      h('Button', {
        props: {
          type: 'text',
          ghost: true
        }
      }, [
        h('Icon', {
          props: {
            type: 'md-trash',
            size: 18,
            color: '#000000'
          }
        })
      ])
    ])
  },
  change: (h, params, vm) => {
    console.log(params)
    return h('div', {
      on: {
        click: (event) => {
          event.stopPropagation()
        }
      }
    }, [
      (params.tableData.length - 1) !== params.index && h('Button', {
        props: {
          type: 'text',
          ghost: true,
          size: 'small'
        },
        on: {
          click: (event) => {
            /**
            * @method on-down-record 列表数据向下移动
            * @params [object]params 返回当前移动行数据
            */
             /**
             * @todo 组件内移动数据方法，组件封装时可通过回调函数异步移动
             */
            vm.$emit('on-down-record', params)
            event.stopPropagation()
            // params.tableData[params.index] = params.tableData.splice(params.index + 1, 1, params.tableData[params.index])[0];
            // 更改列表数据
            // vm.$emit('input', params.tableData)
          }
        }
      }, [
        h('Icon', {
          props: {
            type: 'md-arrow-down',
            size: 18,
            color: '#000000'
          }
        }),
      ]),
      params.index !== 0 && h('Button', {
        props: {
          type: 'text',
          ghost: true,
          size: 'small'
        },
        on: {
          click: (event) => {
            /**
            * @method on-up-record 列表数据向上移动
            * @params [object]params 返回当前移动行数据
            */
            vm.$emit('on-up-record', params)
            event.stopPropagation()
            /**
             * @todo 组件内移动数据方法，组件封装时可通过回调函数异步移动
             */
            // params.tableData[params.index] = params.tableData.splice(params.index - 1, 1, params.tableData[params.index])[0];
            // 更改列表数据
            //vm.$emit('input', params.tableData)
          }
        }        
      }, [
        h('Icon', {
          props: {
            type: 'md-arrow-up',
            size: 18,
            color: '#000000'
          }
        }),
      ]),      
    ])
  }
}
export default btns
