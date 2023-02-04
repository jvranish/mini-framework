/**
 * Applies a function to a clone of the original object, and returns a new object that
 * shares as much structure as possible with the original object.
 * Prototype chains are preserved.
 * @template T
 * @param {T} original
 * @param {(a: T) => void} f
 */
export function sharedUpdate(original, f) {
  // Clone object
  const mutableClone = structuredClone(original);
  // Fixup prototypes in cloned object
  fixupPrototypes(original, mutableClone);

  // Apply update
  f(mutableClone);

  // Share structure with original object
  return share(original, mutableClone);
}

/**
 * This function takes an original object and a mutated clone of that object and
 * returns a new object that shares as much structure as possible with the
 * original object.
 * TODO add special handling for Set, Map
 * @template T
 * @param {T} original
 * @param {T} mutatedCopy
 * @returns {T}
 */
export function share(original, mutatedCopy) {
  if (
    original === mutatedCopy /* these are primitives */ ||
    typeof mutatedCopy !== "object" ||
    typeof original !==
      "object" /* not much we can do here (catches "functions" and such) */ ||
    original === null ||
    mutatedCopy === null /* can't run getPrototypeOf on `null`'s */ ||
    Object.getPrototypeOf(original) !== Object.getPrototypeOf(mutatedCopy)
  ) {
    return mutatedCopy;
  }


  let update;
  if (mutatedCopy instanceof Array) {
    update = [];
  } else {
    update = Object.create(Object.getPrototypeOf(mutatedCopy));
  }
  let useUpdate = false;
  for (let key in mutatedCopy) {
    if (Object.hasOwn(original, key)) {
      update[key] = share(original[key], mutatedCopy[key]);
    } else {
      update[key] = mutatedCopy[key];
      useUpdate = true;
    }
  }
  if (!useUpdate) {
    // If we haven't decided to use the update yet, check if any of the original
    // keys are missing (or different) from the update.
    for (let key in original) {
      if (update[key] !== original[key]) {
        useUpdate = true;
        break;
      }
    }
  }
  if (useUpdate) {
    return update;
  } else {
    return original;
  }
}


/**
 * @template T
 * @param {T} original
 * @param {T} clone
 */
function fixupPrototypes(original, clone) {
  walkTrees(original, clone, (a, b) => {
    if (typeof a === "object" && a !== null && typeof b === "object" && b !== null) {
      if (a.constructor.name !== b.constructor.name || !Object.getPrototypeOf(b).isPrototypeOf(a)) {
        Object.setPrototypeOf(b, Object.getPrototypeOf(a));
      }
    }
  });
}
/**
 * @template T
 * @param {T} a
 * @param {T} b
 * @param {(aValue: any, bValue: any) => void} func
 */
function walkTrees(a, b, func) {
    func(a, b);
    if (typeof a !== "object" || a === null || typeof b !== "object" || b === null) {
      return;
    } else if (a instanceof Map && b instanceof Map) {
        a.forEach((value, key) => {
            walkTrees(value, b.get(key), func);
        });
    } else if (a instanceof Set && b instanceof Set) {
        let index = 0;
        a.forEach((value) => {
            walkTrees(value, Array.from(b)[index], func);
            index++;
        });
    } else {
        for (const key in a) {
            if (Object.hasOwn(a, key)) {
                walkTrees(a[key], b[key], func);
            }
        }
    }
}
