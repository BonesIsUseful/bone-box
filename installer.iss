[Setup]
AppName=BoneBox
AppVersion=0.2.12
AppPublisher=BonesIsUseful
AppId={{741743E5-9D42-4A9B-B03C-D8DCEAF76A22}
DefaultDirName={autopf}\BoneBox
DefaultGroupName=BoneBox
OutputDir=.
OutputBaseFilename=BoneBox - 0.2.12 (Setup)
Compression=lzma2
SolidCompression=yes
ArchitecturesInstallIn64BitMode=x64
PrivilegesRequired=lowest

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"

[Files]
Source: "electron-build\BoneBox-win32-x64\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\BoneBox"; Filename: "{app}\BoneBox.exe"
Name: "{autodesktop}\BoneBox"; Filename: "{app}\BoneBox.exe"; Tasks: desktopicon

[UninstallDelete]
Type: filesandordirs; Name: "{app}\*"
