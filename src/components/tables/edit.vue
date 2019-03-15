<template>
	<div class="tables-edit-outer">
		<div v-if="!isEditting" class="tables-edit-con">
			<span class="value-con">{{ value }}</span>
			<div class="tables-edit-btn" v-if="editable">
				<Button  @click.stop="startEdit"  style="padding: 2px 4px" type="text"><Icon type="md-create" size="16"></Icon></Button>
					<Button style="padding: 2px 4px" type="text" @click.stop="removeEdit"><Icon type="ios-trash" size="16"></Icon></Button>
			</div>
		</div>
		<div v-else class="tables-editting-con">
			<Input :value="value" @input="handleInput" class="tables-edit-input" :maxlength="10"/>
			<Button @click.stop="saveEdit" style="padding: 6px 4px;" type="text"><Icon type="md-checkmark"></Icon></Button>
			<Button @click.stop="canceltEdit" style="padding: 6px 4px;" type="text"><Icon type="md-close"></Icon></Button>
		</div>
	</div>

</template>
<script>
	export default {
		name: 'TablesEdit',
		props: {
			value: [String, Number],
			edittingCellId: String,
			params: Object,
			editable: Boolean
		},
		computed: {
			isEditting () {
				return this.edittingCellId === `editting-${this.params.index}-${this.params.column.key}`
			}
		},
		methods: {
			handleInput (val) {
				this.$emit('input', val)
			},
			startEdit () {
				this.$emit('on-start-edit', this.params)
			},
			saveEdit () {
				this.$emit('on-save-edit', this.params)
			},
			canceltEdit () {
				this.$emit('on-cancel-edit', this.params)
			},
			removeEdit () {
                this.$Modal.confirm({
                    title: '你确定要删除吗?',
                    onOk: () => {
                        this.$emit('on-remove-edit', this.params)
                    }
                });
			},
			ok () {
				this.$emit('input', this.params.tableData.filter((item, index) => index !== this.params.row.initRowIndex))
				
			}
		}
	}
</script>

<style lang="less">
.tables-edit-outer{
	height: 100%;
	.tables-edit-con{
		position: relative;
    	height: 48px;
    	line-height: 48px;
    .value-con{
    	vertical-align: middle;
    }
    .tables-edit-btn{
    	position: absolute;
    	right: 10px;
    	top: 0;
    	display: none;
    }
    &:hover{
    	.tables-edit-btn{
    		display: inline-block;
    	}
    }
}
.tables-editting-con{
	.tables-edit-input{
		width: ~"calc(100% - 60px)";
	}
}
}
</style>
