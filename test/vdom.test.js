import { h, patch } from "../src"

function testTrees(name, trees) {
  test(name, done => {
    let oldNode, element

    trees.forEach(tree => {
      element = patch(oldNode, (oldNode = tree.node), element)
      expect(document.body.innerHTML).toBe(tree.html.replace(/\s{2,}/g, ""))
    })

    done()
  })
}

beforeEach(() => {
  document.body.innerHTML = ""
})

testTrees("replace element", [
  {
    node: h("main", {}),
    html: `<main></main>`
  },
  {
    node: h("div", {}),
    html: `<div></div>`
  }
])

testTrees("replace child", [
  {
    node: h("main", {}, [h("div", {}, "foo")]),
    html: `
        <main>
          <div>foo</div>
        </main>
      `
  },
  {
    node: h("main", {}, [h("main", {}, "bar")]),
    html: `
        <main>
          <main>bar</main>
        </main>
      `
  }
])

testTrees("insert children on top", [
  {
    node: h("main", {}, [
      h(
        "div",
        {
          key: "a",
          oncreate(e) {
            e.id = "a"
          }
        },
        "A"
      )
    ]),
    html: `
        <main>
          <div id="a">A</div>
        </main>
      `
  },
  {
    node: h("main", {}, [
      h(
        "div",
        {
          key: "b",
          oncreate(e) {
            e.id = "b"
          }
        },
        "B"
      ),
      h("div", { key: "a" }, "A")
    ]),
    html: `
        <main>
          <div id="b">B</div>
          <div id="a">A</div>
        </main>
      `
  },
  {
    node: h("main", {}, [
      h(
        "div",
        {
          key: "c",
          oncreate(e) {
            e.id = "c"
          }
        },
        "C"
      ),
      h("div", { key: "b" }, "B"),
      h("div", { key: "a" }, "A")
    ]),
    html: `
        <main>
          <div id="c">C</div>
          <div id="b">B</div>
          <div id="a">A</div>
        </main>
      `
  },
  {
    node: h("main", {}, [
      h(
        "div",
        {
          key: "d",
          oncreate(e) {
            e.id = "d"
          }
        },
        "D"
      ),
      h("div", { key: "c" }, "C"),
      h("div", { key: "b" }, "B"),
      h("div", { key: "a" }, "A")
    ]),
    html: `
        <main>
          <div id="d">D</div>
          <div id="c">C</div>
          <div id="b">B</div>
          <div id="a">A</div>
        </main>
      `
  }
])

testTrees("remove text node", [
  {
    node: h("main", {}, [h("div", {}, ["foo"]), "bar"]),
    html: `
        <main>
          <div>foo</div>
          bar
        </main>
      `
  },
  {
    node: h("main", {}, [h("div", {}, ["foo"])]),
    html: `
        <main>
          <div>foo</div>
        </main>
      `
  }
])

testTrees("replace keyed", [
  {
    node: h("main", {}, [
      h(
        "div",
        {
          key: "a",
          oncreate(e) {
            e.id = "a"
          }
        },
        "A"
      )
    ]),
    html: `
        <main>
          <div id="a">A</div>
        </main>
      `
  },
  {
    node: h("main", {}, [
      h(
        "div",
        {
          key: "b",
          oncreate(e) {
            e.id = "b"
          }
        },
        "B"
      )
    ]),
    html: `
        <main>
          <div id="b">B</div>
        </main>
      `
  }
])

testTrees("reorder keyed", [
  {
    node: h("main", {}, [
      h(
        "div",
        {
          key: "a",
          oncreate(e) {
            e.id = "a"
          }
        },
        "A"
      ),
      h(
        "div",
        {
          key: "b",
          oncreate(e) {
            e.id = "b"
          }
        },
        "B"
      ),
      h(
        "div",
        {
          key: "c",
          oncreate(e) {
            e.id = "c"
          }
        },
        "C"
      ),
      h(
        "div",
        {
          key: "d",
          oncreate(e) {
            e.id = "d"
          }
        },
        "D"
      ),
      h(
        "div",
        {
          key: "e",
          oncreate(e) {
            e.id = "e"
          }
        },
        "E"
      )
    ]),
    html: `
        <main>
          <div id="a">A</div>
          <div id="b">B</div>
          <div id="c">C</div>
          <div id="d">D</div>
          <div id="e">E</div>
        </main>
      `
  },
  {
    node: h("main", {}, [
      h("div", { key: "e" }, "E"),
      h("div", { key: "a" }, "A"),
      h("div", { key: "b" }, "B"),
      h("div", { key: "c" }, "C"),
      h("div", { key: "d" }, "D")
    ]),
    html: `
        <main>
          <div id="e">E</div>
          <div id="a">A</div>
          <div id="b">B</div>
          <div id="c">C</div>
          <div id="d">D</div>
        </main>
      `
  },
  {
    node: h("main", {}, [
      h("div", { key: "e" }, "E"),
      h("div", { key: "d" }, "D"),
      h("div", { key: "a" }, "A"),
      h("div", { key: "c" }, "C"),
      h("div", { key: "b" }, "B")
    ]),
    html: `
        <main>
          <div id="e">E</div>
          <div id="d">D</div>
          <div id="a">A</div>
          <div id="c">C</div>
          <div id="b">B</div>
        </main>
      `
  },
  {
    node: h("main", {}, [
      h("div", { key: "c" }, "C"),
      h("div", { key: "e" }, "E"),
      h("div", { key: "b" }, "B"),
      h("div", { key: "a" }, "A"),
      h("div", { key: "d" }, "D")
    ]),
    html: `
        <main>
          <div id="c">C</div>
          <div id="e">E</div>
          <div id="b">B</div>
          <div id="a">A</div>
          <div id="d">D</div>
        </main>
      `
  }
])

testTrees("grow/shrink keyed", [
  {
    node: h("main", {}, [
      h(
        "div",
        {
          key: "a",
          oncreate(e) {
            e.id = "a"
          }
        },
        "A"
      ),
      h(
        "div",
        {
          key: "b",
          oncreate(e) {
            e.id = "b"
          }
        },
        "B"
      ),
      h(
        "div",
        {
          key: "c",
          oncreate(e) {
            e.id = "c"
          }
        },
        "C"
      ),
      h(
        "div",
        {
          key: "d",
          oncreate(e) {
            e.id = "d"
          }
        },
        "D"
      ),
      h(
        "div",
        {
          key: "e",
          oncreate(e) {
            e.id = "e"
          }
        },
        "E"
      )
    ]),
    html: `
        <main>
          <div id="a">A</div>
          <div id="b">B</div>
          <div id="c">C</div>
          <div id="d">D</div>
          <div id="e">E</div>
        </main>
      `
  },
  {
    node: h("main", {}, [
      h("div", { key: "a" }, "A"),
      h("div", { key: "c" }, "C"),
      h("div", { key: "d" }, "D")
    ]),
    html: `
        <main>
          <div id="a">A</div>
          <div id="c">C</div>
          <div id="d">D</div>
        </main>
      `
  },
  {
    node: h("main", {}, [h("div", { key: "d" }, "D")]),
    html: `
        <main>
          <div id="d">D</div>
        </main>
      `
  },
  {
    node: h("main", {}, [
      h(
        "div",
        {
          key: "a",
          oncreate(e) {
            e.id = "a"
          }
        },
        "A"
      ),
      h(
        "div",
        {
          key: "b",
          oncreate(e) {
            e.id = "b"
          }
        },
        "B"
      ),
      h(
        "div",
        {
          key: "c",
          oncreate(e) {
            e.id = "c"
          }
        },
        "C"
      ),
      h("div", { key: "d" }, "D"),
      h(
        "div",
        {
          key: "e",
          oncreate(e) {
            e.id = "e"
          }
        },
        "E"
      )
    ]),
    html: `
        <main>
          <div id="a">A</div>
          <div id="b">B</div>
          <div id="c">C</div>
          <div id="d">D</div>
          <div id="e">E</div>
        </main>
      `
  },
  {
    node: h("main", {}, [
      h("div", { key: "d" }, "D"),
      h("div", { key: "c" }, "C"),
      h("div", { key: "b" }, "B"),
      h("div", { key: "a" }, "A")
    ]),
    html: `
        <main>
          <div id="d">D</div>
          <div id="c">C</div>
          <div id="b">B</div>
          <div id="a">A</div>
        </main>
      `
  }
])

testTrees("mixed keyed/non-keyed", [
  {
    node: h("main", {}, [
      h(
        "div",
        {
          key: "a",
          oncreate(e) {
            e.id = "a"
          }
        },
        "A"
      ),
      h("div", {}, "B"),
      h("div", {}, "C"),
      h(
        "div",
        {
          key: "d",
          oncreate(e) {
            e.id = "d"
          }
        },
        "D"
      ),
      h(
        "div",
        {
          key: "e",
          oncreate(e) {
            e.id = "e"
          }
        },
        "E"
      )
    ]),
    html: `
        <main>
          <div id="a">A</div>
          <div>B</div>
          <div>C</div>
          <div id="d">D</div>
          <div id="e">E</div>
        </main>
      `
  },
  {
    node: h("main", {}, [
      h("div", { key: "e" }, "E"),
      h("div", {}, "C"),
      h("div", {}, "B"),
      h("div", { key: "d" }, "D"),
      h("div", { key: "a" }, "A")
    ]),
    html: `
        <main>
          <div id="e">E</div>
          <div>C</div>
          <div>B</div>
          <div id="d">D</div>
          <div id="a">A</div>
        </main>
      `
  },
  {
    node: h("main", {}, [
      h("div", {}, "C"),
      h("div", { key: "d" }, "D"),
      h("div", { key: "a" }, "A"),
      h("div", { key: "e" }, "E"),
      h("div", {}, "B")
    ]),
    html: `
        <main>
          <div>C</div>
          <div id="d">D</div>
          <div id="a">A</div>
          <div id="e">E</div>
          <div>B</div>
        </main>
      `
  },
  {
    node: h("main", {}, [
      h("div", { key: "e" }, "E"),
      h("div", { key: "d" }, "D"),
      h("div", {}, "B"),
      h("div", {}, "C")
    ]),
    html: `
        <main>
          <div id="e">E</div>
          <div id="d">D</div>
          <div>B</div>
          <div>C</div>
        </main>
      `
  }
])

testTrees("styles", [
  {
    node: h("div"),
    html: `<div></div>`
  },
  {
    node: h("div", { style: { color: "red", fontSize: "1em" } }),
    html: `<div style="color: red; font-size: 1em;"></div>`
  },
  {
    node: h("div", { style: { color: "blue", float: "left" } }),
    html: `<div style="color: blue; float: left;"></div>`
  },
  {
    node: h("div"),
    html: `<div style=""></div>`
  }
])

testTrees("update element data", [
  {
    node: h("div", { id: "foo", class: "bar" }),
    html: `<div id="foo" class="bar"></div>`
  },
  {
    node: h("div", { id: "foo", class: "baz" }),
    html: `<div id="foo" class="baz"></div>`
  }
])

testTrees("removeAttribute", [
  {
    node: h("div", { id: "foo", class: "bar" }),
    html: `<div id="foo" class="bar"></div>`
  },
  {
    node: h("div"),
    html: `<div></div>`
  }
])

testTrees("skip setAttribute for functions", [
  {
    node: h("div", {
      onclick() {
        /**/
      }
    }),
    html: `<div></div>`
  }
])

testTrees("update element with dynamic props", [
  {
    node: h("input", {
      type: "text",
      oncreate(element) {
        element.value = "bar"
      },
      value: "foo"
    }),
    html: `<input type="text" value="foo">`
  },
  {
    node: h("input", {
      type: "text",
      onupdate(element) {
        expect(element.value).toBe("foo")
      },
      value: "foo"
    }),
    html: `<input type="text" value="foo">`
  }
])

test("oncreate", done => {
  patch(
    null,
    h(
      "div",
      {
        oncreate(element) {
          element.className = "foo"
          expect(document.body.innerHTML).toBe(`<div class="foo">foo</div>`)
          done()
        }
      },
      "foo"
    )
  )
})

test("onupdate", done => {
  var view = value =>
    h(
      "div",
      {
        class: value,
        onupdate(element, oldProps) {
          expect(element.textContent).toBe("foo")
          expect(oldProps.class).toBe("foo")
          done()
        }
      },
      value
    )

  let node = view("foo")
  let element = patch(null, node)

  patch(node, node, element)
})

test("onremove", done => {
  var view = value =>
    value
      ? h(
          "ul",
          {
            oncreate() {
              expect(document.body.innerHTML).toBe(
                "<ul><li></li><li></li></ul>"
              )
            }
          },
          [
            h("li"),
            h("li", {
              onremove(element) {
                element.parentNode.removeChild(element)
                expect(document.body.innerHTML).toBe("<ul><li></li></ul>")
                done()
              }
            })
          ]
        )
      : h("ul", {}, [h("li")])

  let node = view(true)
  let element = patch(null, node)

  patch(node, view(false), element)
})

test("event bubling", done => {
  var view = value =>
    h(
      "main",
      {
        oncreate() {
          expect(count++).toBe(3)
        },
        onupdate() {
          expect(count++).toBe(7)
          done()
        }
      },
      [
        h("p", {
          oncreate() {
            expect(count++).toBe(2)
          },
          onupdate() {
            expect(count++).toBe(6)
          }
        }),
        h("p", {
          oncreate() {
            expect(count++).toBe(1)
          },
          onupdate() {
            expect(count++).toBe(5)
          }
        }),
        h("p", {
          oncreate() {
            expect(count++).toBe(0)
          },
          onupdate() {
            expect(count++).toBe(4)
          }
        })
      ]
    )

  let count = 0
  let node = view(true)
  let element = patch(null, node)

  patch(node, view(false), element)
})
