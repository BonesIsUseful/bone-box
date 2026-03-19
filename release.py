import json
import sys
import os
import re
import subprocess
import argparse

def bump_version(part):
    # 1. Update package.json
    with open('package.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    version = data['version']
    v_parts = [int(p) for p in version.split('.')]
    
    if part == 'major':
        v_parts[1] += 1
        v_parts[2] = 0
    elif part == 'minor':
        v_parts[2] += 1
    
    new_version = ".".join(map(str, v_parts))
    
    # Update package.json
    data['version'] = new_version
    with open('package.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    
    # 2. Update editor/EditorConfig.js
    config_path = os.path.join('editor', 'EditorConfig.js')
    if os.path.exists(config_path):
        with open(config_path, 'r', encoding='utf-8') as f:
            content = f.read()
        new_content = re.sub(r'\|\|\s*\"[0-9]+\.[0-9]+\.[0-9]+\"', f'|| "{new_version}"', content)
        with open(config_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
            
    return version, new_version

def run_command(cmd, description):
    print(f"\n--- {description} ---")
    print(f"Running: {cmd}")
    try:
        result = subprocess.run(cmd, shell=True, check=True)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error during {description}: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description="Release BoneBox update")
    parser.add_argument("type", choices=["major", "minor"], help="Type of update (major bumps 0.X.0, minor bumps 0.2.X)")
    parser.add_argument("message", help="Commit message suffix")
    parser.add_argument("-d", "--dist", action="store_true", help="Build the standalone executable (npm run dist)")
    parser.add_argument("-p", "--push", action="store_true", help="Automatically push to GitHub")

    args = parser.parse_args()

    old_v, new_v = bump_version(args.type)
    print(f"Bumping version: {old_v} -> {new_v}")

    # Build if requested
    if args.dist:
        if not run_command("npm run dist", "Building Standalone Executable"):
            print("Build failed. Aborting git operations.")
            sys.exit(1)

    # Git Operations
    full_message = f"v{new_v} - {args.message}"
    
    if run_command("git add .", "Staging Changes"):
        if run_command(f'git commit -m "{full_message}"', "Committing"):
            if args.push:
                if run_command("git push", "Pushing to GitHub"):
                    print(f"\n🚀 Version v{new_v} pushed to GitHub!")
                    
                    # Create GitHub Release if build was generated
                    if args.dist:
                        release_cmd = f'gh release create v{new_v} dist_final/*.exe --title "v{new_v}" --notes "{args.message}"'
                        if run_command(release_cmd, "Creating GitHub Release"):
                            print(f"\n🎁 Standalone build attached to GitHub Release v{new_v}!")
                        else:
                            print("\n⚠️ Failed to create GitHub Release. You can try manually via the web.")
                else:
                    print(f"\n⚠️ Version bumped and committed, but 'git push' failed.")
                    print("Please check your git credentials and try pushing manually.")
            else:
                print(f"\n✅ Version bumped to v{new_v} and committed locally.")
                print("Note: GitHub Release wasn't created because -p (push) was not used.")
                print("Run 'git push' and 'gh release create' manually if desired.")

if __name__ == "__main__":
    main()
