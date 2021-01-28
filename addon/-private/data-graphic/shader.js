
export function factoriesFor(gl) {
  const { VERTEX_SHADER, FRAGMENT_SHADER, LINK_STATUS, COMPILE_STATUS } = gl;

  class Program {
    #program;

    constructor({ shaders, attributes, uniforms }) {
      const program = this.#program = gl.createProgram();

      for (let [ type, source ] of [ [ VERTEX_SHADER, shaders.vertex ], [ FRAGMENT_SHADER, shaders.fragment ] ]) {
        const shader = gl.createShader(type);

        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, COMPILE_STATUS)) {
          throw new Error(gl.getShaderInfoLog(shader))
        }

        gl.attachShader(program, shader);
      }

      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program))
      };
    }
  }

}


gl.attachShader(prg, vertexShader);
gl.attachShader(prg, fragmentShader);
gl.linkProgram(prg);
