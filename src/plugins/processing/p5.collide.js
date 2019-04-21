let Collide = (extendClass) => class extends extendClass {
  constructor (sketch, $el) {
    super(sketch, $el)
    this._collideDebug = false
  }
  collideDebug (debugMode) {
    this._collideDebug = debugMode
  }
  collidePointLine (px, py, x1, y1, x2, y2, buffer) {
    // get distance from the point to the two ends of the line
    const d1 = this.dist(px, py, x1, y1)
    const d2 = this.dist(px, py, x2, y2)

    // get the length of the line
    const lineLen = this.dist(x1, y1, x2, y2)

    // since floats are so minutely accurate, add a little buffer zone that will give collision
    if (buffer === undefined) {
      buffer = 0.1
    } // higher # = less accurate

    // if the two distances are equal to the line's length, the point is on the line!
    // note we use the buffer here to give a range, rather than one #
    return d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer
  }

  collideRectCircle (rx, ry, rw, rh, cx, cy, diameter) {
    // 2d
    // temporary variables to set edges for testing
    let testX = cx
    let testY = cy

    // which edge is closest?
    if (cx < rx) {
      testX = rx // left edge
    } else if (cx > rx + rw) {
      testX = rx + rw
    } // right edge

    if (cy < ry) {
      testY = ry // top edge
    } else if (cy > ry + rh) {
      testY = ry + rh
    } // bottom edge

    // // get distance from closest edges
    let distance = this.dist(cx, cy, testX, testY)

    // if the distance is less than the radius, collision!
    return distance <= diameter / 2
  };

  collideCircleCircle (x, y, d, x2, y2, d2) {
    // 2d
    return this.dist(x, y, x2, y2) <= (d / 2) + (d2 / 2)
  };

  collidePointCircle (x, y, cx, cy, d) {
    // 2d
    return this.dist(x, y, cx, cy) <= d / 2
  };

  collidePointEllipse (x, y, cx, cy, dx, dy) {
    // 2d
    let rx = dx / 2
    let ry = dy / 2
    // Discarding the points outside the bounding box
    if (x > cx + rx || x < cx - rx || y > cy + ry || y < cy - ry) {
      return false
    }
    // Compare the point to its equivalent on the ellipse
    let xx = x - cx
    let yy = y - cy
    let eyy = ry * this.sqrt(this.abs(rx * rx - xx * xx)) / rx
    return yy <= eyy && yy >= -eyy
  };

  collideRectRect (x, y, w, h, x2, y2, w2, h2) {
    // 2d
    // add in a thing to detect rectMode CENTER
    if (x + w >= x2 && // r1 right edge past r2 left
      x <= x2 + w2 && // r1 left edge past r2 right
      y + h >= y2 && // r1 top edge past r2 bottom
      y <= y2 + h2) { // r1 bottom edge past r2 top
      return true
    }
    return false
  };

  collidePointRect (pointX, pointY, x, y, xW, yW) {
    // 2d
    if (pointX >= x && // right of the left edge AND
      pointX <= x + xW && // left of the right edge AND
      pointY >= y && // below the top AND
      pointY <= y + yW) { // above the bottom
      return true
    }
    return false
  };

  collideLineCircle (x1, y1, x2, y2, cx, cy, diameter) {
    // is either end INSIDE the circle?
    // if so, return true immediately
    let inside1 = this.collidePointCircle(x1, y1, cx, cy, diameter)
    let inside2 = this.collidePointCircle(x2, y2, cx, cy, diameter)
    if (inside1 || inside2) return true

    // get length of the line
    let distX = x1 - x2
    let distY = y1 - y2
    let len = this.sqrt((distX * distX) + (distY * distY))

    // get dot product of the line and circle
    let dot = (((cx - x1) * (x2 - x1)) + ((cy - y1) * (y2 - y1))) / this.pow(len, 2)

    // find the closest point on the line
    let closestX = x1 + (dot * (x2 - x1))
    let closestY = y1 + (dot * (y2 - y1))

    // is this point actually on the line segment?
    // if so keep going, but if not, return false
    let onSegment = this.collidePointLine(closestX, closestY, x1, y1, x2, y2)
    if (!onSegment) return false

    // draw a debug circle at the closest point on the line
    if (this._collideDebug) {
      this.ellipse(closestX, closestY, 10, 10)
    }

    // get distance to closest point
    distX = closestX - cx
    distY = closestY - cy
    let distance = this.sqrt((distX * distX) + (distY * distY))

    return distance <= diameter / 2
  }

  collideLineLine (x1, y1, x2, y2, x3, y3, x4, y4, calcIntersection) {
    let intersection

    // calculate the distance to intersection point
    let uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))
    let uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))
    let intersectionX
    let intersectionY
    // if uA and uB are between 0-1, lines are colliding
    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
      if (this._collideDebug || calcIntersection) {
        // calc the point where the lines meet
        intersectionX = x1 + (uA * (x2 - x1))
        intersectionY = y1 + (uA * (y2 - y1))
      }

      if (this._collideDebug) {
        this.ellipse(intersectionX, intersectionY, 10, 10)
      }

      if (calcIntersection) {
        intersection = {
          'x': intersectionX,
          'y': intersectionY
        }
        return intersection
      } else {
        return true
      }
    }
    if (calcIntersection) {
      intersection = {
        'x': false,
        'y': false
      }
      return intersection
    }
    return false
  }

  collideLineRect (x1, y1, x2, y2, rx, ry, rw, rh, calcIntersection) {
    // check if the line has hit any of the rectangle's sides. uses the collideLineLine function above
    let left, right, top, bottom, intersection

    if (calcIntersection) {
      left = this.collideLineLine(x1, y1, x2, y2, rx, ry, rx, ry + rh, true)
      right = this.collideLineLine(x1, y1, x2, y2, rx + rw, ry, rx + rw, ry + rh, true)
      top = this.collideLineLine(x1, y1, x2, y2, rx, ry, rx + rw, ry, true)
      bottom = this.collideLineLine(x1, y1, x2, y2, rx, ry + rh, rx + rw, ry + rh, true)
      intersection = {
        'left': left,
        'right': right,
        'top': top,
        'bottom': bottom
      }
    } else {
      // return booleans
      left = this.collideLineLine(x1, y1, x2, y2, rx, ry, rx, ry + rh)
      right = this.collideLineLine(x1, y1, x2, y2, rx + rw, ry, rx + rw, ry + rh)
      top = this.collideLineLine(x1, y1, x2, y2, rx, ry, rx + rw, ry)
      bottom = this.collideLineLine(x1, y1, x2, y2, rx, ry + rh, rx + rw, ry + rh)
    }

    // if ANY of the above are true, the line has hit the rectangle
    if (left || right || top || bottom) {
      if (calcIntersection) {
        return intersection
      }
      return true
    }
    return false
  }

  collidePointPoly (px, py, vertices) {
    let collision = false

    // go through each of the vertices, plus the next vertex in the list
    let next = 0
    for (let current = 0; current < vertices.length; current++) {
      // get next vertex in list if we've hit the end, wrap around to 0
      next = current + 1
      if (next === vertices.length) next = 0

      // get the PVectors at our current position this makes our if statement a little cleaner
      let vc = vertices[current] // c for "current"
      let vn = vertices[next] // n for "next"

      // compare position, flip 'collision' variable back and forth
      if (((vc.y > py && vn.y < py) || (vc.y < py && vn.y > py)) &&
        (px < (vn.x - vc.x) * (py - vc.y) / (vn.y - vc.y) + vc.x)) {
        collision = !collision
      }
    }
    return collision
  }

  // POLYGON/CIRCLE
  collideCirclePoly (cx, cy, diameter, vertices, interior) {
    if (interior === undefined) {
      interior = false
    }

    // go through each of the vertices, plus the next vertex in the list
    let next = 0
    for (let current = 0; current < vertices.length; current++) {
      // get next vertex in list if we've hit the end, wrap around to 0
      next = current + 1
      if (next === vertices.length) next = 0

      // get the PVectors at our current position this makes our if statement a little cleaner
      let vc = vertices[current] // c for "current"
      let vn = vertices[next] // n for "next"

      // check for collision between the circle and a line formed between the two vertices
      let collision = this.collideLineCircle(vc.x, vc.y, vn.x, vn.y, cx, cy, diameter)
      if (collision) return true
    }

    // test if the center of the circle is inside the polygon
    if (interior === true) {
      let centerInside = this.collidePointPoly(cx, cy, vertices)
      if (centerInside) return true
    }

    // otherwise, after all that, return false
    return false
  }

  collideRectPoly (rx, ry, rw, rh, vertices, interior) {
    if (interior === undefined) {
      interior = false
    }

    // go through each of the vertices, plus the next vertex in the list
    let next = 0
    for (let current = 0; current < vertices.length; current++) {
      // get next vertex in list if we've hit the end, wrap around to 0
      next = current + 1
      if (next === vertices.length) next = 0

      // get the PVectors at our current position this makes our if statement a little cleaner
      let vc = vertices[current] // c for "current"
      let vn = vertices[next] // n for "next"

      // check against all four sides of the rectangle
      let collision = this.collideLineRect(vc.x, vc.y, vn.x, vn.y, rx, ry, rw, rh)
      if (collision) return true

      // optional: test if the rectangle is INSIDE the polygon note that this iterates all sides of the polygon again, so only use this if you need to
      if (interior === true) {
        let inside = this.collidePointPoly(rx, ry, vertices)
        if (inside) return true
      }
    }

    return false
  }

  collideLinePoly (x1, y1, x2, y2, vertices) {
    // go through each of the vertices, plus the next vertex in the list
    let next = 0
    for (let current = 0; current < vertices.length; current++) {
      // get next vertex in list if we've hit the end, wrap around to 0
      next = current + 1
      if (next === vertices.length) next = 0

      // get the PVectors at our current position extract X/Y coordinates from each
      let x3 = vertices[current].x
      let y3 = vertices[current].y
      let x4 = vertices[next].x
      let y4 = vertices[next].y

      // do a Line/Line comparison if true, return 'true' immediately and stop testing (faster)
      let hit = this.collideLineLine(x1, y1, x2, y2, x3, y3, x4, y4)
      if (hit) {
        return true
      }
    }
    // never got a hit
    return false
  }

  collidePolyPoly (p1, p2, interior) {
    if (interior === undefined) {
      interior = false
    }

    // go through each of the vertices, plus the next vertex in the list
    let next = 0
    for (let current = 0; current < p1.length; current++) {
      // get next vertex in list, if we've hit the end, wrap around to 0
      next = current + 1
      if (next === p1.length) next = 0

      // get the PVectors at our current position this makes our if statement a little cleaner
      let vc = p1[current] // c for "current"
      let vn = p1[next] // n for "next"

      // use these two points (a line) to compare to the other polygon's vertices using polyLine()
      let collision = this.collideLinePoly(vc.x, vc.y, vn.x, vn.y, p2)
      if (collision) return true

      // check if the 2nd polygon is INSIDE the first
      if (interior === true) {
        collision = this.collidePointPoly(p2[0].x, p2[0].y, p1)
        if (collision) return true
      }
    }

    return false
  }

  collidePointTriangle (px, py, x1, y1, x2, y2, x3, y3) {
    // get the area of the triangle
    let areaOrig = this.abs((x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1))

    // get the area of 3 triangles made between the point and the corners of the triangle
    let area1 = this.abs((x1 - px) * (y2 - py) - (x2 - px) * (y1 - py))
    let area2 = this.abs((x2 - px) * (y3 - py) - (x3 - px) * (y2 - py))
    let area3 = this.abs((x3 - px) * (y1 - py) - (x1 - px) * (y3 - py))

    // if the sum of the three areas equals the original, we're inside the triangle!
    if (area1 + area2 + area3 === areaOrig) {
      return true
    }
    return false
  }

  collidePointPoint (x, y, x2, y2, buffer) {
    if (buffer === undefined) {
      buffer = 0
    }

    if (this.dist(x, y, x2, y2) <= buffer) {
      return true
    }

    return false
  };

  collidePointArc (px, py, ax, ay, arcRadius, arcHeading, arcAngle, buffer) {
    if (buffer === undefined) {
      buffer = 0
    }
    // point
    let point = this.createVector(px, py)
    // arc center point
    let arcPos = this.createVector(ax, ay)
    // arc radius vector
    let radius = this.createVector(arcRadius, 0).rotate(arcHeading)

    let pointToArc = point.copy().sub(arcPos)

    if (point.dist(arcPos) <= (arcRadius + buffer)) {
      let dot = radius.dot(pointToArc)
      let angle = radius.angleBetween(pointToArc)
      if (dot > 0 && angle <= arcAngle / 2 && angle >= -arcAngle / 2) {
        return true
      }
    }
    return false
  }
}

export default Collide
