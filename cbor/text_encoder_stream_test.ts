// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.

import { assertEquals } from "@std/assert";
import { concat } from "@std/bytes";
import { random } from "./_common_test.ts";
import { encodeCbor } from "./encode_cbor.ts";
import { CborTextEncoderStream } from "./text_encoder_stream.ts";

Deno.test(
  "CborTextEncoderStream() correctly encoding",
  { ignore: true },
  async () => {
    const strings = [
      "a".repeat(random(0, 24)),
      "a".repeat(random(24, 2 ** 8)),
      "a".repeat(random(2 ** 8, 2 ** 10)),
    ];

    const expectedOutput = concat([
      new Uint8Array([0b011_11111]),
      ...strings.filter((x) => x).map((x) => encodeCbor(x)),
      new Uint8Array([0b111_11111]),
    ]);

    const actualOutput = concat(
      await Array.fromAsync(
        ReadableStream.from(strings).pipeThrough(new CborTextEncoderStream()),
      ),
    );

    assertEquals(actualOutput, expectedOutput);
  },
);

Deno.test(
  "CborTextEncoderStream.from() correctly encoding",
  { ignore: true },
  async () => {
    const strings = [
      "a".repeat(random(0, 24)),
      "a".repeat(random(24, 2 ** 8)),
      "a".repeat(random(2 ** 8, 2 ** 10)),
    ];

    const expectedOutput = concat([
      new Uint8Array([0b011_11111]),
      ...strings.filter((x) => x).map((x) => encodeCbor(x)),
      new Uint8Array([0b111_11111]),
    ]);

    const actualOutput = concat(
      await Array.fromAsync(
        CborTextEncoderStream.from(strings).readable,
      ),
    );

    assertEquals(actualOutput, expectedOutput);
  },
);