<template>
    <!--  选择分组组件 -->
    <div
        v-else
        class="select-group"
    >
        <Dropdown
            trigger="click"
            placement="bottom-start"
        >
            <a
                href="javascript:void(0)"
                @click="handleOpen"
            >
                <Input
                    :placeholder="placeholder"
                    class="select-tree"
                    readonly
                    v-model="selectTreeModel"
                    :multiple="true"
                    ref="selectTree"
                    :style="{width: width + 'px'}"
                >
                <Icon
                    type="ios-arrow-down"
                    size="14"
                    slot="suffix"
                    v-bind:class="[turn, {run: isRun}]"
                />
                </Input>
            </a>
            <!-- isShowChecbox -->
            <DropdownMenu slot="list">
                <el-tree
                    lazy
                    ref="tree"
                    :props="propsOptions"
                    :load="loadData"
                    @check="onCheckChange"
                    @node-click="onSelectChange"
                    :check-on-click-node="!isShowChecbox"
                    :expand-on-click-node="false"
                    :check-strictly="true"
                    :highlight-current="!isShowChecbox"
                    :show-checkbox="isShowChecbox"
                    :style="{width: width + 'px', maxHeight: height + 'px', overflow: 'auto'}"
                >
                </el-tree>
            </DropdownMenu>
        </Dropdown>
    </div>
</template>
<script>
export default {
    name: 'SelectTree',
    props: {
        propsOptions: {
            type: Object,
            default: function() {
                return {
                    label: 'title',
                    children: 'children',
                    isLeaf: data => {
                        if (data.childNodeNum == 0) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                };
            }
        },
        dataTree: {
            type: Array,
            default() {
                return [
                    {
                        title: 'parent 1',
                        expand: true,
                        children: []
                    }
                ];
            }
        },
        width: {
            type: Number,
            default() {
                return 360;
            }
        },
        placeholder: {
            type: String,
            default() {
                return '请选择';
            }
        },
        height: {
            type: Number,
            default() {
                return 300;
            }
        },
        title: {
            type: String,
            default() {
                return '';
            }
        },
        id: {
            type: [String, Number],
            default() {
                return '';
            }
        },
        isShowChecbox: {
            type: Boolean,
            default() {
                return false;
            }
        },
        isOnlyTree: {
            type: Boolean,
            default() {
                return false;
            }
        },
        marginTop: {
            type: Number,
            default() {
                return 10;
            }
        },
        marginBottom: {
            type: Number,
            default() {
                return 20;
            }
        }
    },
    data() {
        return {
            count: 0, //计数
            selectTreeModel: null,
            isRun: false,
            turn: 'turn',
            grouping: [],
            expandNodeNumber: []
        };
    },
    watch: {
        title(newVal) {
            this.selectTreeModel = newVal;
        }
    },
    methods: {
        /**
         * 获取分组数据,可自动获取，不需要
         */
        getAllGouping() {
            // this.$http.get(this.url).then(res => {
            //     this.expandNodeNumber = [res.data[0].groupId];
            // });
        },
        /**
         * 获取子集分组数据
         */
        loadData(item, resolve) {
            this.$emit('on-load-data', item, resolve);
        },
        handleOpen() {
            this.isRun === true ? this.isRun = false : this.isRun = true;
        },
        onSelectChange(item) {
            if (this.isShowChecbox) {
                return;
            }
            let params = '';
            if (item) {
                this.selectTreeModel = item[this.propsOptions.label];
                params = item;
            } else {
                this.selectTreeModel = '';
                params = {};
            }

            this.$emit('on-select-change', params);
            if (!this.isOnlyTree) {
                const selectEl = this.$refs['selectTree'].$el.children[2];
                if (selectEl) {
                    selectEl.focus();
                    selectEl.blur();
                }
            }
        },
        onCheckChange(value, data) {
            if (!this.isShowChecbox) {
                return;
            }
            const item = data.checkedNodes;
            !this.isOnlyTree && this.checkedDataShow(item);
            this.$emit('on-check-change', item);
            const selectEl = this.$refs['selectTree'].$el.children[2];
            if (selectEl) {
                selectEl.focus();
                selectEl.blur();
            }
        },
        checkedDataShow(item) {
            let dataList = [];
            if (item.length !== 0) {
                item.forEach(data => {
                    dataList.push(data[this.propsOptions.label]);
                });
            }
            this.selectTreeModel = dataList.toString();
        }
    }
};
</script>

<style lang="less">
.select-group {
    .select-tree {
        > input {
            cursor: pointer;
        }
        .turn {
            transition: all 0.2s ease-in-out;
        }
        .run {
            transform: rotate(180deg);
        }
    }
    .tree-height {
        max-height: 600px;
        overflow-y: auto;
    }
    .ivu-tree-empty {
        padding-left: 7px;
    }
    .ivu-select-dropdown {
        .ivu-dropdown-menu {
            max-height: 300px;
            overflow: hidden;
            padding: 0 0 0 10px;
        }
    }
    .ivu-tree-arrow {
        width: 18px;
        .ivu-icon {
            font-size: 16px;
        }
    }
}
</style>