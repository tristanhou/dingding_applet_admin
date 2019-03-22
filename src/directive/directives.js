const directives = {
    focus: {
        inserted: function (el) {
            // 聚焦元素
            el.focus();
        }
    }
};

export default directives;
