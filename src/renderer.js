import { Scene } from '@babylonjs/core/scene';
import { UniversalCamera } from '@babylonjs/core/Cameras/universalCamera';
import { PointLight } from '@babylonjs/core/Lights/pointLight';
import { CreateSphere } from '@babylonjs/core/Meshes/Builders/sphereBuilder';
import { CreateBox } from '@babylonjs/core/Meshes/Builders/boxBuilder';
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { VertexData } from '@babylonjs/core/Meshes/mesh.vertexData'
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { RawTexture } from '@babylonjs/core/Materials/Textures/rawTexture';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { Vector2, Vector3 } from '@babylonjs/core/Maths/math.vector';

const BASE_URL = import.meta.env.BASE_URL || '/';

class Renderer {
    constructor(canvas, engine, material_callback, ground_mesh_callback) {
        this.canvas = canvas;
        this.engine = engine;
        this.scenes = [
            {
                scene: new Scene(this.engine),
                background_color: new Color4(0.1, 0.1, 0.1, 1.0),
                materials: null,
                ground_subdivisions: [50, 50],
                ground_mesh: null,
                camera: null,
                ambient: new Color3(0.2, 0.2, 0.2),
                lights: [],
                models: []
            },
            {
                scene: new Scene(this.engine),
                background_color: new Color4(0.0, 0.0, 0.0, 1.0),
                materials: null,
                ground_subdivisions: null,
                ground_mesh: null,
                camera: null,
                ambient: new Color3(0.1, 0.1, 0.1),
                lights: [],
                models: []
            },
            {
                scene: new Scene(this.engine),
                background_color: new Color4(0.0, 0.0, 0.0, 1.0),
                materials: null,
                ground_subdivisions: null,
                ground_mesh: null,
                camera: null,
                ambient: new Color3(0.1, 0.1, 0.1),
                lights: [],
                models: []
            },
            {
                scene: new Scene(this.engine),
                background_color: new Color4(0.0, 0.0, 0.0, 1.0),
                materials: null,
                ground_subdivisions: null,
                ground_mesh: null,
                camera: null,
                ambient: new Color3(0.1, 0.1, 0.1),
                lights: [],
                models: []
            }
        ];
        this.active_scene = 0;
        this.active_light = 0;
        this.shading_alg = 'gouraud';

        this.scenes.forEach((scene, idx) => {
            scene.materials = material_callback(scene.scene);
            if (scene.ground_subdivisions) {
                scene.ground_mesh = ground_mesh_callback(scene.scene, scene.ground_subdivisions);
            }
            this.createScene(idx);
        });
    }

    createScene(scene_idx) {
        let current_scene = this.scenes[scene_idx];
        let scene = current_scene.scene;
        let materials = current_scene.materials;
        let ground_mesh = current_scene.ground_mesh;

        // Set scene-wide / environment values
        scene.clearColor = current_scene.background_color;
        scene.ambientColor = current_scene.ambient;
        scene.useRightHandedSystem = true;

        // Create camera
        current_scene.camera = new UniversalCamera('camera', new Vector3(0.0, 1.8, 10.0), scene);
        current_scene.camera.setTarget(new Vector3(0.0, 1.8, 0.0));
        current_scene.camera.upVector = new Vector3(0.0, 1.0, 0.0);
        current_scene.camera.keysLeft = [65];
        current_scene.camera.keysRight = [68];
        current_scene.camera.keysUp = [87];
        current_scene.camera.keysDown = [83];
        current_scene.camera.keysUpward = [32];
        current_scene.camera.keysDownward = [16];
        current_scene.camera.speed = 0.5;
        current_scene.camera.attachControl(this.canvas, true);
        current_scene.camera.fov = 35.0 * (Math.PI / 180);
        current_scene.camera.minZ = 0.1;
        current_scene.camera.maxZ = 100.0;

        if (scene_idx == 0) {
            // Create point light sources
            let light0 = new PointLight('light0', new Vector3(1.0, 1.0, 5.0), scene);
            light0.diffuse = new Color3(1.0, 1.0, 1.0);
            light0.specular = new Color3(1.0, 1.0, 1.0);
            current_scene.lights.push(light0);

            let light1 = new PointLight('light1', new Vector3(0.0, 3.0, 0.0), scene);
            light1.diffuse = new Color3(1.0, 1.0, 1.0);
            light1.specular = new Color3(1.0, 1.0, 1.0);
            current_scene.lights.push(light1);

            // Create ground mesh
            let white_texture = RawTexture.CreateRGBTexture(new Uint8Array([255, 255, 255]), 1, 1, scene);
            let ground_heightmap = new Texture(BASE_URL + 'heightmaps/default.png', scene);
            ground_mesh.scaling = new Vector3(20.0, 1.0, 20.0);
            ground_mesh.metadata = {
                mat_color: new Color3(0.10, 0.65, 0.15),
                mat_texture: white_texture,
                mat_specular: new Color3(0.0, 0.0, 0.0),
                mat_shininess: 1,
                texture_scale: new Vector2(1.0, 1.0),
                height_scalar: 1.0,
                heightmap: ground_heightmap
            }
            ground_mesh.material = materials['ground_' + this.shading_alg];
            
            // Create other models
            let sphere = CreateSphere('sphere', { segments: 32 }, scene);
            sphere.position = new Vector3(1.0, 0.5, 3.0);
            sphere.metadata = {
                mat_color: new Color3(0.10, 0.35, 0.88),
                mat_texture: white_texture,
                mat_specular: new Color3(0.8, 0.8, 0.8),
                mat_shininess: 16,
                texture_scale: new Vector2(1.0, 1.0)
            }
            sphere.material = materials['illum_' + this.shading_alg];
            current_scene.models.push(sphere);

            let box = CreateBox('box', { width: 2, height: 1, depth: 1 }, scene);
            box.position = new Vector3(-1.0, 0.5, 2.0);
            box.metadata = {
                mat_color: new Color3(0.75, 0.15, 0.05),
                mat_texture: white_texture,
                mat_specular: new Color3(0.4, 0.4, 0.4),
                mat_shininess: 4,
                texture_scale: new Vector2(1.0, 1.0)
            }
            box.material = materials['illum_' + this.shading_alg];
            current_scene.models.push(box);

            let ring = Renderer.CreateRing({ segments: 32, radius: 0.5, width: 0.25, thickness: 0.25 }, scene);
            ring.position = new Vector3(0.0, 0.5, -1.0);
            ring.metadata = {
                mat_color: new Color3(0.95, 0.75, 0.05),
                mat_texture: white_texture,
                mat_specular: new Color3(0.6, 0.6, 0.6),
                mat_shininess: 8,
                texture_scale: new Vector2(1.0, 1.0)
            }
            ring.material = materials['illum_' + this.shading_alg];
            current_scene.models.push(ring);
        } else if (scene_idx == 1) {
            // Create point light sources
            let light0 = new PointLight('light0', new Vector3(1.0, 3.0, 5.0), scene);
            light0.diffuse = new Color3(1.0, 1.0, 1.0);
            light0.specular = new Color3(1.0, 1.0, 1.0);
            current_scene.lights.push(light0);
            
            // Create other models
            let sphere = CreateSphere('sphere', { segments: 32 }, scene);
            sphere.position = new Vector3(0.0, 0.0, -1.0);
            sphere.rotation = new Vector3(0.0, 0.0, -30 / 180 * Math.PI);
            sphere.metadata = {
                mat_color: new Color3(1.0, 1.0, 1.0),
                mat_texture: new Texture("public/textures/saturnmap.jpg"),
                mat_specular: new Color3(0.2, 0.2, 0.2),
                mat_shininess: 1,
                texture_scale: new Vector2(1.0, 1.0)
            }
            sphere.material = materials['illum_' + this.shading_alg];
            current_scene.models.push(sphere);

            let ring = Renderer.CreateRing({ segments: 32, radius: 1, width: 0.01, thickness: 0.25 }, scene);
            ring.position = new Vector3(0.0, 0.0, -1.0);
            ring.rotation = new Vector3(0.0, 0.0, -120 / 180 * Math.PI);
            ring.metadata = {
                mat_color: new Color3(1.0, 1.0, 1.0),
                mat_texture: new Texture("public/textures/saturnringcolor.jpg"),
                mat_specular: new Color3(0.6, 0.6, 0.6),
                mat_shininess: 8,
                texture_scale: new Vector2(4.0, 4.0)
            }
            ring.material = materials['illum_' + this.shading_alg];
            current_scene.models.push(ring);
        } else if (scene_idx == 2) {
            // Create point light sources
            let light0 = new PointLight('light0', new Vector3(1.0, 3.0, 5.0), scene);
            light0.diffuse = new Color3(0.5, 0.0, 1.0);
            light0.specular = new Color3(1.0, 1.0, 1.0);
            current_scene.lights.push(light0);

            let light1 = new PointLight('light1', new Vector3(1.0, 3.0, -5.0), scene);
            light1.diffuse = new Color3(0.0, 0.3, 1.0);
            light1.specular = new Color3(1.0, 1.0, 1.0);
            current_scene.lights.push(light1);
            
            // Create other models
            let sphere = CreateSphere('sphere', { segments: 32 }, scene);
            sphere.position = new Vector3(0.0, 0.0, -1.0);
            sphere.rotation = new Vector3(0.0, 0.0, -30 / 180 * Math.PI);
            sphere.metadata = {
                mat_color: new Color3(1.0, 1.0, 1.0),
                mat_texture: new Texture("public/textures/saturnmap.jpg"),
                mat_specular: new Color3(0.2, 0.2, 0.2),
                mat_shininess: 1,
                texture_scale: new Vector2(1.0, 1.0)
            }
            sphere.material = materials['illum_' + this.shading_alg];
            current_scene.models.push(sphere);

            let ring = Renderer.CreateRing({ segments: 32, radius: 1, width: 0.01, thickness: 0.25 }, scene);
            ring.position = new Vector3(0.0, 0.0, -1.0);
            ring.rotation = new Vector3(0.0, 0.0, -120 / 180 * Math.PI);
            ring.metadata = {
                mat_color: new Color3(1.0, 1.0, 1.0),
                mat_texture: new Texture("public/textures/saturnringcolor.jpg"),
                mat_specular: new Color3(0.6, 0.6, 0.6),
                mat_shininess: 8,
                texture_scale: new Vector2(4.0, 4.0)
            }
            ring.material = materials['illum_' + this.shading_alg];
            current_scene.models.push(ring);
        } else if (scene_idx == 3) {
            // Create point light sources
            let light0 = new PointLight('light0', new Vector3(1.0, 5.0, 5.0), scene);
            light0.diffuse = new Color3(1.0, 1.0, 1.0);
            light0.specular = new Color3(1.0, 1.0, 1.0);
            current_scene.lights.push(light0);

            let light1 = new PointLight('light1', new Vector3(1.0, -12.0, -3.0), scene);
            light1.diffuse = new Color3(1.0, 1.0, 1.0);
            light1.specular = new Color3(1.0, 1.0, 1.0);
            current_scene.lights.push(light1);
            
            // Create other models
            let sphere = CreateSphere('sphere', { segments: 32 }, scene);
            sphere.position = new Vector3(0.0, 0.0, -1.0);
            sphere.rotation = new Vector3(0.0, 0.0, -30 / 180 * Math.PI);
            sphere.metadata = {
                mat_color: new Color3(0.1, 0.5, 0.5),
                mat_texture: new Texture("public/textures/saturnmap.jpg"),
                mat_specular: new Color3(0.2, 0.2, 0.2),
                mat_shininess: 1,
                texture_scale: new Vector2(1.0, 1.0)
            }
            sphere.material = materials['illum_' + this.shading_alg];
            current_scene.models.push(sphere);

            let ring = Renderer.CreateRing({ segments: 32, radius: 1, width: 0.01, thickness: 0.25 }, scene);
            ring.position = new Vector3(0.0, 0.0, -1.0);
            ring.rotation = new Vector3(0.0, 0.0, -120 / 180 * Math.PI);
            ring.metadata = {
                mat_color: new Color3(1.0, 1.0, 1.0),
                mat_texture: new Texture("public/textures/saturnringcolor.jpg"),
                mat_specular: new Color3(0.6, 0.6, 0.6),
                mat_shininess: 8,
                texture_scale: new Vector2(4.0, 4.0)
            }
            ring.material = materials['illum_' + this.shading_alg];
            current_scene.models.push(ring);
        }

        // Animation function - called before each frame gets rendered
        scene.onBeforeRenderObservable.add(() => {
            // update models and lights here (if needed)
            // ...

            // update uniforms in shader programs
            this.updateShaderUniforms(scene_idx, materials['illum_' + this.shading_alg]);
            this.updateShaderUniforms(scene_idx, materials['ground_' + this.shading_alg]);
        });
    }

    static CreateRing(params, scene) {
        const ring = new Mesh("custom", scene);
        const ringData = new VertexData();
        ringData.positions = [];
        ringData.indices = [];

        // Curved faces
        for (let i = 0; i < 2; i++) {
            for (let s = 0; s < params.segments; s++) {
                for (let v = 0; v < 4; v++) {
                    ringData.positions.push(-params.width / 2 + params.width * Math.floor(v / 2));
                    const ringSize = params.radius - i * params.thickness;
                    ringData.positions.push(ringSize * Math.cos(2 * Math.PI * (s + v % 2) / params.segments));
                    ringData.positions.push(ringSize * Math.sin(2 * Math.PI * (s + v % 2) / params.segments));
                }
                const outOffset = params.segments * 4;
                const iBase = outOffset * i + 4 * s;
                if (i == 1) {
                    ringData.indices.push(iBase, iBase + 1, iBase + 2, iBase + 3, iBase + 2, iBase + 1);                    
                } else {
                    ringData.indices.push(iBase + 2, iBase + 1, iBase, iBase + 1, iBase + 2, iBase + 3);
                }
            }
        }
        // Sides
        for (let s = 0; s < params.segments; s++) {
            const outOffset = params.segments * 4;
            const iBase = outOffset + 4 * s;
            const sideIndices = [[iBase, iBase - outOffset, iBase + 1, iBase - outOffset + 1, iBase + 1, iBase - outOffset], [iBase + 2, iBase - outOffset + 2, iBase + 3, iBase - outOffset + 3, iBase + 3, iBase - outOffset + 2]];
            for (let i = 0; i < 2; i++) {
                for (let v = 0; v < 6; v++) {
                    ringData.positions.push(ringData.positions[0 + 3 * sideIndices[i][v]]);
                    ringData.positions.push(ringData.positions[1 + 3 * sideIndices[i][v]]);
                    ringData.positions.push(ringData.positions[2 + 3 * sideIndices[i][v]]);
                }
                ringData.indices.push(...sideIndices[i]);
            }
        }

        ringData.normals = [];
        VertexData.ComputeNormals(ringData.positions, ringData.indices, ringData.normals);
        ringData.applyToMesh(ring, true);
        return ring;
    }

    updateShaderUniforms(scene_idx, shader) {
        let current_scene = this.scenes[scene_idx];
        shader.setVector3('camera_position', current_scene.camera.position);
        shader.setColor3('ambient', current_scene.scene.ambientColor);
        shader.setInt('num_lights', current_scene.lights.length);
        let light_positions = [];
        let light_colors = [];
        current_scene.lights.forEach((light) => {
            light_positions.push(light.position.x, light.position.y, light.position.z);
            light_colors.push(light.diffuse);
        });
        shader.setArray3('light_positions', light_positions);
        shader.setColor3Array('light_colors', light_colors);
    }

    getActiveScene() {
        return this.scenes[this.active_scene].scene;
    }
    
    setActiveScene(idx) {
        this.active_scene = idx;
    }

    setShadingAlgorithm(algorithm) {
        this.shading_alg = algorithm;

        this.scenes.forEach((scene) => {
            let materials = scene.materials;
            let ground_mesh = scene.ground_mesh;

            if (scene.ground_subdivisions) {
                ground_mesh.material = materials['ground_' + this.shading_alg];
            }
            scene.models.forEach((model) => {
                model.material = materials['illum_' + this.shading_alg];
            });
        });
    }

    setHeightScale(scale) {
        this.scenes.forEach((scene) => {
            let ground_mesh = scene.ground_mesh;
            ground_mesh.metadata.height_scalar = scale;
        });
    }

    setActiveLight(idx) {
        console.log(idx);
        this.active_light = idx;
    }
}

export { Renderer }
