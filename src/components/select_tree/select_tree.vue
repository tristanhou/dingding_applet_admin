<template>
  <Dropdown trigger="custom"  :visible="visible" placement="bottom-start">
    <a href="javascript:void(0)" @click="handleOpen">
      <Input  :placeholder="placeholder" class="select-tree" readonly v-model="selectTreeModel" :multiple="true" :style="{width: width + 'px'}">
        <Icon type="ios-arrow-down" size="14" slot="suffix"  v-bind:class="[turn, {run: isRun}]"/>
      </Input>
    </a>
    <DropdownMenu slot="list">
      <Tree @on-select-change="onSelectChange" @on-check-change="onCheckChange" :data="dataTree" :show-checkbox="isShowCheckbox" :style="{minWidth: width + 'px', maxHeight: height + 'px', overflowY: 'auto'}" ></Tree>
    </DropdownMenu>
  </Dropdown>
</template>
<script>
export default {
    name: 'SelectTree',
    props: {
        dataTree: {
            type: Array,
            default () {
                return [];
            }
        },
        width: {
            type: Number,
            default () {
                return 180;
            }
        },
        placeholder: {
            type: String,
            default () {
                return '请选择';
            }
        },
        height: {
            type: Number,
            default () {
                return 600;
            }
        },
        isShowCheckbox: {
            type: Boolean,
            default () {
                return false;
            }
        }
    },
    data () {
        return {
            selectTreeModel: null,
            visible: false,
            isRun: false,
            turn: 'turn'
        };
    },
    methods: {
        handleOpen () {
            this.visible === true ? this.visible = false : this.visible = true;
            this.isRun === true ? this.isRun = false : this.isRun = true;
        },
        onSelectChange (item) {
            if (item.length !== 0) {
                this.selectTreeModel = item[0].name;
            } else {
                this.selectTreeModel = null;
            }
            this.visible = false;
            this.$emit('on-select-change', item);
        },
        onCheckChange (item) {
            let dataList = [];
            if (item.length !== 0) {
                item.forEach(data => {
                    dataList.push(data.name);
                });
            }
            this.selectTreeModel = dataList.toString();
            this.$emit('on-check-change', item);
        }
    }
};
</script>

<style lang="less">
@import './index.less';
</style>
