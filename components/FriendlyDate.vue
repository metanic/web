<template>
  <FriendlyTime :time=date :prefix=timePrefix />
  <!--
    TODO: Does this work?
    <span v-if=friendlyDate> {{ friendlyDate }} </span>
  -->
</template>


<script>
  import moment from 'moment'

  import FriendlyTime from '~/components/FriendlyTime'

  export default {
    components: { FriendlyTime },

    props: {
      date: [Date, String],
      datePrefix: { type: String, required: false },
      timePrefix: { type: String, required: false },
    },

    computed: {
      friendlyDate: function () {
        const now = moment()
        const date = moment(this.date)
        const prefix = this.datePrefix || ' on '

        if (now.format(moment.HTML5_FMT.DATE) === date.format(moment.HTML5_FMT.DATE)) {
          return
        }

        if (now.format(moment.HTML5_FMT.WEEK) === date.format(moment.HTML5_FMT.WEEK)) {
          return ' ' + prefix + ' ' + date.format('dddd')
        }

        return date.format(moment.HTML5_FMT.DATE)
      },
    },
  }
</script>
