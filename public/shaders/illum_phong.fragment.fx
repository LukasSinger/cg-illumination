#version 300 es
precision mediump float;

// Input
in vec3 model_position;
in vec3 model_normal;
in vec2 model_uv;

// Uniforms
// material
uniform vec3 mat_color;
uniform vec3 mat_specular;
uniform float mat_shininess;
uniform sampler2D mat_texture;
// camera
uniform vec3 camera_position;
// lights
uniform vec3 ambient; // Ia
uniform int num_lights;
uniform vec3 light_positions[8];
uniform vec3 light_colors[8]; // Ip

// Output
out vec4 FragColor;

void main() {
    // Ambient    
    vec3 model_color = mat_color * texture(mat_texture, model_uv).rgb;
    vec3 ambient_color = ambient * model_color;
    // Diffuse
    vec3 light_dir = normalize(light_positions[0] - model_position);
    vec3 diffuse_color = light_colors[0] * model_color * max(0.0, dot(model_normal, light_dir));
    // Specular
    vec3 view_dir = normalize(camera_position - model_position);
    vec3 reflected_light = reflect(-light_dir, model_normal);
    vec3 specular_color = light_colors[0] * mat_specular * pow(max(dot(reflected_light, view_dir), 0.0), mat_shininess);
    // Combined
    FragColor = vec4(ambient_color + diffuse_color + specular_color, 1.0);
}
