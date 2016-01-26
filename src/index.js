import {ProseMirror, defineOption, Keymap} from "prosemirror/src/edit"
import {Block, Inline, Attribute, Schema, defaultSchema} from "prosemirror/src/model"
import {elt} from "prosemirror/src/dom"
import {InputRule} from "prosemirror/src/inputrules"
import {Tooltip} from "prosemirror/src/ui/tooltip"
import "prosemirror/src/menu/menubar"
import "prosemirror/src/inputrules/autoinput"

// Create a new node type.
class Fruit extends Inline {
  // Not sure what this does
  // get attrs() { return {type: new Attribute("orange")} }
}

// Serialize a node into a DOM element.
//
// This method is invoked whenever the node object is rendered to the DOM.
Fruit.prototype.serializeDOM = (node) => {
  // Define multiple image srcs, which helps you see when the node rerenders.
  let srcs = [
    "http://realfood.tesco.com/media/images/Orange-and-almond-srping-cake-hero-58d07750-0952-47eb-bc41-a1ef9b81c01a-0-472x310.jpg",
    "https://d3nevzfk7ii3be.cloudfront.net/igi/KRLMkuaBjm5mKDDP",
    "http://www.mannatechblog.com/wp-content/uploads/2014/12/Orange_Slice.jpg"
  ]
  let src = srcs[Math.floor( Math.random() * srcs.length )];
  return elt("img", {
    src: src,
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
  // Not sure what this does
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

// Sometimes you may want to rerender a node based on any arbitrary reason. e.g.
// you're waiting for an API response that has data required to render a node,
// but want to offer the user a placeholder loading image while that is happening.
window.rerenderContentInSecondNode = () => {
  // Mark the second node "dirty"
  pm.dirtyNodes.set( pm.doc.content.content[1], 2 /* i.e. DIRTY_REDRAW */ );

  // can't call this directly because it short-circuits if not an "operation".
  // pm.flush()

  // Force a redraw. Not sure exactly what this does.
  pm.startOperation();
}
