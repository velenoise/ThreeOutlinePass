uniform float amount;

void main()
{
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vec4 displacement = vec4(normalize(normalMatrix * normal) * (amount * 0.02), 0.0) + mvPosition; 
    
    gl_Position = projectionMatrix * displacement;
}