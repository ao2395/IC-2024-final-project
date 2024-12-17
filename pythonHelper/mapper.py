import os
import json
from PIL import Image
import numpy as np

def image_to_pixel_array(image_path, target_size=(39, 39)):
    """
    Convert an image to a 2D array of raw pixel data and ensure it is resized to a specific size.

    Parameters:
    image_path (str): The path to the input image.
    target_size (tuple): The desired dimensions for the image (width, height).

    Returns:
    tuple: A 2D numpy array of pixel data (as (R, G, B) tuples) and image dimensions.
    """
    # Open the image
    image = Image.open(image_path)

    # Resize the image to the target size
    image = image.resize(target_size)  # Smooth resizing

    # Ensure the image is in RGB format
    image = image.convert("RGB")

    # Get the pixel data as a numpy array
    pixels = np.array(image)
    
    # Return the 2D array and dimensions
    return pixels, image.size

def save_pixel_array_to_json(image_path, pixel_array):
    """
    Save a 2D pixel array to a .json file with R, G, B values for each pixel.

    Parameters:
    image_path (str): The path to the input image.
    pixel_array (numpy.ndarray): The 2D pixel array to save.
    """
    # Get the base name of the image (without extension)
    base_name = os.path.splitext(os.path.basename(image_path))[0]

    # Create the output file name
    output_file = f"{base_name}.json"

    # Build a JSON structure for the pixel data
    json_data = []
    for y, row in enumerate(pixel_array):
        row_data = []
        for x, pixel in enumerate(row):
            r, g, b = pixel
            row_data.append({"r": int(r), "g": int(g), "b": int(b)})
        json_data.append(row_data)

    # Write the JSON data to a file
    with open(output_file, "w") as file:
        json.dump(json_data, file, indent=4)

    print(f"Pixel data saved to {output_file}")

# Example usage
if __name__ == "__main__":
    image_path = "arena3.png"  # Replace with your image name
    pixel_array, dimensions = image_to_pixel_array(image_path)
    save_pixel_array_to_json(image_path, pixel_array)
    print(f"Image dimensions after resizing: {dimensions}")
