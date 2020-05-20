Component({
  options: {},
  properties: {
    title: {
      type: String,
      value: ''
    },
    subTitle: {
      type: String,
      value: ''
    },
    show: {
      type: Boolean,
      value: false
    },
    buttons: {
      type: Array,
      value: [{
          type: 'default',
          className: '',
          text: '取消',
          value: 0
        },
        {
          type: 'primary',
          className: '',
          text: '确定',
          value: 1
        }
      ]
    },
    col: {
      type: Number,
      value: 1
    },
    column_1: {
      type: Array,
      value: []
    },
    column_2: {
      type: Array,
      value: []
    },
    column_3: {
      type: Array,
      value: []
    },
  },
  data:{
    index: []
  },
  methods: {
    bindchange: function(e) {
      this.setData({
        index: e.detail.value
      })
    },
    close: function(e){
      if (!this.data.index.length){
        var index = []
        for(let i = 0; i<this.properties.col;i++){
          index.push(0)
        }
        this.triggerEvent('change', {
          index: index
        }, {})
      }else {
        this.triggerEvent('change', {
          index: this.data.index
        }, {})
      }
    }
  }
});