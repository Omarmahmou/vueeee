<template>
  <input
    :value="value"
    @input="$emit('input', $event.target.value)"
    placeholder="Search product..."
  />
</template>

<script>
export default {
  props: ["value"],
};
</script>
