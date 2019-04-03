<template>
	<div :style="{marginTop: marginTop + 'px', marginBottom: '20px'}" class="tables-edit-outer">
		<Table
			ref="tablesMain"
			:data="insideTableData"
			:columns="insideColumns"
			:stripe="stripe"
			:border="border"
			:show-header="showHeader"
			:width="width"
			:height="height"
			:loading="loading"
			:disabled-hover="disabledHover"
			:highlight-row="highlightRow"
			:row-class-name="rowClassName"
			:size="size"
			:no-data-text="noDataText"
			:no-filtered-data-text="noFilteredDataText"
			@on-current-change="onCurrentChange"
			@on-select="onSelect"
			@on-select-cancel="onSelectCancel"
			@on-select-all="onSelectAll"
			@on-select-all-cancel="onSelectAllCancel"
			@on-selection-change="onSelectionChange"
			@on-sort-change="onSortChange"
			@on-filter-change="onFilterChange"
			@on-row-click="onRowClick"
			@on-row-dblclick="onRowDblclick"
			@on-expand="onExpand"
		>
			<slot name="header" slot="header"></slot>
			<slot name="footer" slot="footer" v-if="showFooter">
				<div class="administrator-page" data-automation="page">
					<Page :page-size-opts="[10,20,50]":total="totalPage" :current="current" @on-change="onChange" @on-page-size-change="onPageSizeChange" show-total show-elevator show-sizer :page-size="20"></Page>
				</div>
			</slot>
			<slot name="loading" slot="loading"></slot>
		</Table>
	</div>
</template>
<script>
import TablesEdit from './edit.vue';
import handleBtns from './handle-btns';
import './index.less';
export default {
    name: 'Tables',
    props: {
        value: {
            type: Array,
            default () {
                return [];
            }
        },
        columns: {
            type: Array,
            default () {
                return [];
            }
        },
        size: String,
        width: {
            type: [Number, String]
        },
        height: {
            type: [Number, String]
        },
        stripe: {
            type: Boolean,
            default: false
        },
        border: {
            type: Boolean,
            default: false
        },
        showHeader: {
            type: Boolean,
            default: true
        },
        highlightRow: {
            type: Boolean,
            default: false
        },
        rowClassName: {
            type: Function,
            default () {
                return '';
            }
        },
        context: {
            type: Object
        },
        noDataText: {
            type: String
        },
        noFilteredDataText: {
            type: String
        },
        disabledHover: {
            type: Boolean
        },
        loading: {
            type: Boolean,
            default: false
        },
        /**
         * @description 全局设置是否可编辑
         */
        editable: {
            type: Boolean,
            default: false
        },
        /**
         * @description 是否可搜索
         */
        searchable: {
            type: Boolean,
            default: false
        },
        /**
         * @description 搜索控件所在位置，'top' / 'bottom'
         */
        searchPlace: {
            type: String,
            default: 'top'
        },
        showFooter: {
            type: Boolean,
            default: true
        },
        marginTop: {
            type: Number,
            default: 20
        },
        totalPage: {
            type: Number,
            default: 20
        },
        current: {
            type: Number,
            default: 1
        }
    },
    /**
    * Events
    * @on-start-edit 返回值 {Object} ：同iview中render函数中的params对象 { row, index, column }
    * @on-cancel-edit 返回值 {Object} 同上
    * @on-save-edit 返回值 {Object} ：除上面三个参数外，还有一个value: 修改后的数据
    */
    data () {
        return {
            insideColumns: [],
            insideTableData: [],
            edittingCellId: '',
            edittingText: '默认分类',
            searchValue: '',
            searchKey: '',
            isDadaChange: false
        };
    },
    methods: {
        suportEdit (item) {
            item.render = (h, params) => {
                params.tableData = this.value;
                return h(TablesEdit, {
                    props: {
                        params: params,
                        value: this.insideTableData[params.index][params.column.key],
                        edittingCellId: this.edittingCellId,
                        editable: this.editable
                    },
                    on: {
                        'input': val => {
                            this.edittingText = val;
                            this.isDadaChange = true;
                        },
                        'on-start-edit': (params) => {
                            this.edittingCellId = `editting-${params.index}-${params.column.key}`;
                            this.$emit('on-start-edit', params);
                        },
                        'on-cancel-edit': (params) => {
                            this.edittingCellId = '';
                            this.$emit('on-cancel-edit', params);
                        },
                        'on-save-edit': (params) => {
                            if (!this.edittingText) {
                                this.$Message.warning('分类名称不能为空');
                                return;
                            }
                            this.isDadaChange && (this.value[params.row.initRowIndex][params.column.key] = this.edittingText);
                            this.isDadaChange = false;
                            this.$emit('input', this.value);
                            this.$emit('on-save-edit', Object.assign(params, { value: this.edittingText }));
                            this.edittingCellId = '';
                        },
                        'on-remove-edit': (params) => {
                            this.$emit('on-remove-edit', params);
                            this.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex));
                        }
                    }
                });
            };
            return item;
        },
        surportHandle (item) {
            let options = item.options || [];
            let insideBtns = [];
            options.forEach(item => {
                if (handleBtns[item]) insideBtns.push(handleBtns[item]);
            });
            let btns = item.button ? [].concat(insideBtns, item.button) : insideBtns;
            item.render = (h, params) => {
                params.tableData = this.value;
                return h('div', btns.map(item => item(h, params, this)));
            };
            return item;
        },
        handleColumns (columns) {
            this.insideColumns = columns.map((item, index) => {
                let res = item;
                if (res.editable) res = this.suportEdit(res, index);
                if (res.key === 'handle') res = this.surportHandle(res);
                return res;
            });
        },
        setDefaultSearchKey () {
            this.searchKey = this.columns[0].key !== 'handle' ? this.columns[0].key : this.columns.length > 1 ? this.columns[1].key : '';
        },
        handleClear (e) {
            if (e.target.value === '') this.insideTableData = this.value;
        },
        handleSearch () {
            this.insideTableData = this.value.filter(item => item[this.searchKey].indexOf(this.searchValue) > -1);
        },
        handleTableData () {
            this.insideTableData = this.value.map((item, index) => {
                let res = item;
                res.initRowIndex = index;
                this.columns.forEach(v => {
                    if (v.enum) {
                        v.enum.forEach(d => {
                            if (Number(item[v.key]) === Number(Object.keys(d)[0])) {
                                item[v.key] = Object.values(d)[0];
                            }
                        });
                    }
                });
                return res;
            });
        },
        exportCsv (params) {
            this.$refs.tablesMain.exportCsv(params);
        },
        clearCurrentRow () {
            this.$refs.talbesMain.clearCurrentRow();
        },
        onCurrentChange (currentRow, oldCurrentRow) {
            this.$emit('on-current-change', currentRow, oldCurrentRow);
        },
        onSelect (selection, row) {
            this.$emit('on-select', selection, row);
        },
        onSelectCancel (selection, row) {
            this.$emit('on-select-cancel', selection, row);
        },
        onSelectAll (selection) {
            this.$emit('on-select-all', selection);
        },
        onSelectAllCancel (selection) {
            this.$emit('on-select-all-cancel', selection);
        },
        onSelectionChange (selection) {
            this.$emit('on-selection-change', selection);
        },
        onSortChange (column, key, order) {
            this.$emit('on-sort-change', column, key, order);
        },
        onFilterChange (row) {
            this.$emit('on-filter-change', row);
        },
        onRowClick (row, index) {
            this.$emit('on-row-click', row, index);
        },
        onRowDblclick (row, index) {
            this.$emit('on-row-dblclick', row, index);
        },
        onExpand (row, status) {
            this.$emit('on-expand', row, status);
        },
        onChange (page) {
            this.$emit('on-page-change', page);
        },
        onPageSizeChange (size) {
            this.$emit('on-page-size-change', size);
        }
    },
    watch: {
        columns (columns) {
            this.handleColumns(columns);
            this.setDefaultSearchKey();
           
        },
        value () {
            this.handleTableData();
            if (this.searchable) this.handleSearch();
        },
        deep:true
    },
    mounted () {
        this.handleColumns(this.columns);
        this.setDefaultSearchKey();
        this.handleTableData();
    }
};
</script>
