<script>
import { h } from "vue";

// A toast's message as people see it, and after it, visually hidden, what it was about.
// A render function, not a template: the formatter would put the message on a line of its own,
// and the toast body's `white-space: pre-wrap` would then show the spaces around it.
export default {
    props: {
        msg: { type: String, required: true },
        about: { type: String, required: true },
    },
    render() {
        return h("span", [this.msg, h("span", { class: "visually-hidden" }, " " + this.about)]);
    },
};
</script>
