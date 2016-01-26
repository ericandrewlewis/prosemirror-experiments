import {ProseMirror, defineOption, Keymap} from "prosemirror/dist/edit"
import {Block, Inline, Attribute, Schema, defaultSchema} from "prosemirror/dist/model"
import {elt} from "prosemirror/dist/dom"
import {InputRule} from "prosemirror/dist/inputrules"
import {Tooltip} from "prosemirror/dist/ui/tooltip"
import "prosemirror/dist/menu/menubar"
import "prosemirror/dist/inputrules/autoinput"

// Create a new node type. For this example we'll use fruit.
class Fruit extends Inline {
  // get attrs() {
    // return {type: new Attribute("orange")}
  // }
}

// Serialize a node into a DOM element.
//
// This method is invoked whenever the node object is rendered to the DOM.
Fruit.prototype.serializeDOM = (node) => {
  return elt("img", {
    src: "https://d3nevzfk7ii3be.cloudfront.net/igi/KRLMkuaBjm5mKDDP",
    title: node.attrs.type,
    width: "120",
    height: "90"
  })
}

// We'll want to create Fruit nodes, so this allows us to type [orange] in the
// editor and automatically convert that into a node instance.
//
// Every node type has a "registry," which various core functionality uses. This
// registers an InputRule for the "autoInput" component to utilize.
Fruit.register("autoInput",
  new InputRule(
    "closeFruit",
    new RegExp("\\[(orange)\\]$"),
    "]",
    function(pm, match, pos) {
      let start = pos.move(-match[0].length)
      pm.tr.delete(start, pos).insertInline(start, this.create({type: match[1]})).apply()
    }
  )
)

// Register an insert command for the Fruit node type.
//
// This lets us execute the code `pm.execCommand("fruit:insert")` which inserts
// a fruit node into the document.
Fruit.register("command", {
  name: "insert",
  // Something to do with
  derive: {
    params: [
      // {label: "Type", attr: "type", type: "select", options: ['glerf'], default: 'glerf'}
    ]
  },
  label: "Insert fruit"
})

// Defining this property will make the Insert dropdown in the toolbar menu
// populate with a Fruit option.
Fruit.prototype.insertMenuOptions = [{label: "Fruit", command: "insert", rank: 50}]

// Create a custom schema that includes the fruit node type.
const fruitSchema = new Schema(defaultSchema.spec.update({fruit: Fruit}))

// Create the ProseMirror instance
let pm = window.pm = new ProseMirror({
  place: document.querySelector("#editor"),
  menuBar: true,
  doc: document.querySelector("#content").innerHTML,
  docFormat: "html",
  schema: fruitSchema,
  autoInput: true
})
