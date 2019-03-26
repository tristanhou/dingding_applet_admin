<template>
  <div class="equpment-seach" data-automation="equpmentInput">
    <div class="equpment-seach-bar">
        <Select
            v-if="isChange"
            v-model="searchkey"
            style="width:80px"
            @on-change="onChange"
        >
            <Option
                v-for="item in searchSelect"
                :value="item.value"
                :key="item.value"
            >{{ item.label }}
            </Option>
        </Select>
      <textarea class="active-focus" @blur="seachData(false)" ref="seach" @focus="addSeachValue" :placeholder="placeholder" v-model.trim="seachvalue"
        type="text"></textarea>
    </div>
    <div class="step-bar" v-if="stepBar">
      IMEI卡计数：{{seachArray.length}}
    </div>
    <Modal v-model="modal" title="警告" @on-ok="seachData(true)" width="300px" @on-cancel="modal = false">
      <p>最多可搜索1000张IMEI卡，超出系统自动截取前1000张IMEI卡，是否继续搜索！</p>
    </Modal>
  </div>
</template>
<script>
  export default {
      data() {
          return {
              searchkey:this.imeiKey,//选择的方式
              placeholder:'请输入多个IMEI号，多个IMEI请用换行',
              seachvalue: '', //绑定的搜索数据
              seachString: '', //计算好的数据
              seachArray: [], //搜索字符格式化素数组
              stepBar: false, //计数框
              modal: false,
          };
      },
      props:{
          searchSelect:{
              type:Array,
              default:function(){
                  return [
                      {
                          label:'IMEI',
                          value:'imeis',
                          placeholder:'请输入多个IMEI号，多个IMEI请用换行',
                          multiple:true
                      },
                      {
                          label:'设备名称',
                          value:'deviceName',
                          placeholder:'请输入设备名称',
                      },
                      {
                          label:'SIM卡号',
                          value:'sim',
                          placeholder:'请输入SIM卡号',
                      }
                  ];
              }
          },
          imeiKey:{
              type:String,
              default:'imeis'
          },
          isChange:{
              type:Boolean,
              default:true
          }
      },
      methods: {
          //   切换搜索选项
          onChange(value){
              const textareaEl = this.$refs['seach'];
              this.$utils.removeClass(textareaEl,'active-focus');
              this.searchSelect.forEach(item =>{
                  if(item.value === value){
                      this.placeholder = item.placeholder;
                      if(item.multiple){
                          this.$utils.addClass(textareaEl,'active-focus');
                      }
                  }
              });
              this.$emit('on-change',value);
          },
          // 搜索IMEI号
          seachData(val) {
              this.$Message.destroy();
              if(this.searchkey == 'imeis'){
                  this.multiSelect(val);
              }else{
                  this.radioSelect(val);
              }
          },
          radioSelect(){
              this.$emit('on-search-value', this.seachvalue);
          },
          multiSelect(val){
              this.stepBar = false;
              if (this.seachArray.length == 1) {
                  if (this.seachArray[0].length !== 15) {
                      return this.$Message.error('请输入正确的IMEI号！');
                  }
              }
              //   超过一千搜索进行确认
              if (this.seachArray.length > 1000 && !val) {
                  return this.modal = true;
              }
              // 截取前1000
              let repeatArray = this.seachArray.filter((item, index) => {
                  return index < 1000;
              });
              // 去掉重复
              repeatArray = repeatArray.filter((element, index, self) => {
                  return self.indexOf(element) === index;
              });
              // 重复提示
              let str = '';
              repeatArray.forEach((value) => {
                  if(value != ''){
                      str += `${value},`;
                  }
                  
              });
              if (str[str.length - 1] === ',') {
                  str = str.slice(0, str.length - 1);
              }
              this.$emit('on-search-value', str);
          },
          //   输入多个IMEI卡号
          addSeachValue() {
              if(this.searchkey !== 'imeis'){
                  return;
              }
              this.stepBar = true;
          },
          // 重置并将用户输入的数据发送
          reset() {
              this.stepBar = false;
          },
          stepValue() {
              this.seachString = this.seachvalue
                  .replace(/\r\n/gi, ',')
                  .replace(/\n/gi, ',')
                  .replace(/(^\s+)|(\s+$)/g, '')
                  .replace(/\s/g, '');
              if (this.seachString) {
                  this.seachArray = String(this.seachString).split(',');
              } else {
                  this.seachArray = [];
              }
          },
          toClearVal (val) {
              this.seachvalue = val;
          }
      },
      watch: {
          seachvalue() {
              this.stepValue();
          }
      }
  };

</script>

<style lang="less">
  .equpment-seach {
    width: 100%;
    height: 32px;
    display: inline-block;
    position: relative;
    .equpment-seach-bar {
        .ivu-select {
        position: absolute;
        z-index: 1001;
        top: 1px;
        left: 1px;
        border: none;
        box-shadow: none;
        text-align: center;
        height: 30px;
        .ivu-select-selection {
            height: 30px;
            border: none;
            box-shadow: none;
            .ivu-select-selected-value {
                padding: 0 20px 0 8px;
            }
            .ivu-select-selection{
                margin-top: 30px;
            }
        }
        .ivu-select-arrow {
            font-size: 12px;
        }
    }
      >textarea:-ms-input-placeholder {
        color: #bbbec4;
      }

      textarea::-webkit-input-placeholder {
        color: #bbbec4;
      }

      >textarea {
        width: 100%;
        outline: none;
        height: 32px;
        border: 1px solid #d7d7d7;
        box-sizing: border-box;
        font-size: 12px;
        padding-top: 3px;
        line-height: 24px;
        padding-left: 87px;
        color: #4b4c51;
        z-index: 11;
        position: absolute;
        top: 0;
        left: 0px;
        resize: none;
        overflow: auto;
        &:focus{
            border-color: #55a7ff;
        }
      }
    .active-focus{
        &:focus {
            height: 200px;
            border-color: #55a7ff;
        }
    }
      >button {
        height: 100%;
        border: none;
        width: 60px;
        float: right;
        font-size: 20px;
        color: #fff;
        background-color: #55a7ff;
        cursor: pointer;
        border-top-right-radius: 16px;
        border-bottom-right-radius: 16px;
      }
    }

    .step-bar {
      width: 100%;
      background-color: #fff;
      height: 39px;
      border: solid #ccc;
      border-width: 0 1px 1px;
      box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
      position: absolute;
      top: 200px;
      line-height: 39px;
      padding: 0 10px;
      z-index: 1001;
    }
  }
</style>
