<template>
  <div>
    <test>
      <template v-slot:slot>
        <test2></test2>
      </template>
    </test>
  </div>
</template>

<script>
import test from './index'
export default {

}
</script>

<style scoped lang="scss">
</style>
