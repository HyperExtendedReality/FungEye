
input_file = "src/utils/mushrooms.txt"
output_file = "src/utils/labels.ts"

try:
    with open(input_file, 'r') as f:
        lines = f.readlines()

    formatted_lines = []
    for line in lines:
        stripped = line.strip()
        if stripped:
            # almond_mushroom -> Almond Mushroom
            formatted = stripped.replace('_', ' ').title()
            formatted_lines.append(f"  '{formatted}',")

    with open(output_file, 'w') as f:
        f.write("export const MUSHROOM_LABELS = [\n")
        f.write("\n".join(formatted_lines))
        f.write("\n];\n")

    print(f"Successfully wrote {len(formatted_lines)} labels to {output_file}")

except Exception as e:
    print(f"Error: {e}")
