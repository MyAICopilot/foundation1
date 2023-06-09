import matplotlib.pyplot as plt
import matplotlib.patches as patches
import json

# JSON block diagram description
diagram = json.loads("""
{
    "blocks": [
        {
            "type": "rectangle",
            "id": "set_point",
            "position": {"x": 0, "y": 5},
            "size": {"width": 2, "height": 1},
            "text": "Set Point"
        },
        {
            "type": "circle",
            "id": "summation",
            "center": {"x": 4, "y": 5},
            "radius": 0.5,
            "text": "+/-"
        },
        {
            "type": "rectangle",
            "id": "controller",
            "position": {"x": 6, "y": 4.5},
            "size": {"width": 2, "height": 1},
            "text": "Controller"
        },
        {
            "type": "rectangle",
            "id": "actuator",
            "position": {"x": 10, "y": 4.5},
            "size": {"width": 2, "height": 1},
            "text": "Actuator"
        },
        {
            "type": "rectangle",
            "id": "process_plant",
            "position": {"x": 14, "y": 4.5},
            "size": {"width": 2, "height": 1},
            "text": "Process/Plant"
        },
        {
            "type": "rectangle",
            "id": "sensor",
            "position": {"x": 18, "y": 4.5},
            "size": {"width": 2, "height": 1},
            "text": "Sensor"
        }
    ],
    "lines": [
        {
            "path": [{"x": 2, "y": 5.5}, {"x": 3.5, "y": 5.5}],
            "arrowhead": true
        },
        {
            "path": [{"x": 8, "y": 5}, {"x": 10, "y": 5}],
            "arrowhead": true
        },
        {
            "path": [{"x": 12, "y": 5}, {"x": 14, "y": 5}],
            "arrowhead": true
        },
        {
            "path": [{"x": 16, "y": 5}, {"x": 18, "y": 5}],
            "arrowhead": true
        },
        {
            "path": [{"x": 20, "y": 5}, {"x": 22, "y": 5}, {"x": 22, "y": 2}, {"x": 4.5, "y": 2}, {"x": 4.5, "y": 4.5}],
            "arrowhead": true
        },
        {
            "path": [{"x": 4.5, "y": 5.5}, {"x": 5.5, "y": 5.5}],
            "arrowhead": true
        }
    ]
}

""")

fig, ax = plt.subplots()

# Draw the blocks
for block in diagram['blocks']:
    rect = patches.Rectangle(
        (block['position']['x'], block['position']['y']),
        block['size']['width'], block['size']['height'],
        linewidth=1, edgecolor='r', facecolor='none'
    )
    ax.add_patch(rect)
    ax.text(
        block['position']['x'] + block['size']['width'] / 2,
        block['position']['y'] + block['size']['height'] / 2,
        block['text'],
        horizontalalignment='center',
        verticalalignment='center'
    )

# Draw the lines
for line in diagram['lines']:
    ax.arrow(
        line['start']['x'], line['start']['y'],
        line['end']['x'] - line['start']['x'], line['end']['y'] - line['start']['y'],
        head_width=0.2, head_length=0.2, fc='k', ec='k'
    )

plt.xlim(-1, 21)
plt.ylim(-3, 3)
plt.gca().set_aspect('equal', adjustable='box')
plt.show()
