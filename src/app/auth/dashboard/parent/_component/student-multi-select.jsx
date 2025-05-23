// "use client";

// import { useEffect, useState } from "react";
// import {
//   Command,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Badge } from "@/components/ui/badge";
// import { X } from "lucide-react";
// import useAuthAxios from "@/hooks/use-auth-axios";

// export default function StudentMultiSelect({ value = [], onChange }) {
//   const authAxios = useAuthAxios();
//   const [students, setStudents] = useState([]);
//   const [search, setSearch] = useState("");

//   useEffect(() => {
//     authAxios.get("/auth/dashboard/student").then((res) => {
//       const fetchedStudents = Array.isArray(res.data)
//         ? res.data
//         : res.data?.data || [];

//       setStudents(fetchedStudents);
//     });
//   }, []);

//   const selectedIds = new Set(value.map((v) => v.id ?? v));

//   const toggleSelect = (student) => {
//     const exists = value.find((v) => v === student.id || v.id === student.id);
//     if (exists) {
//       onChange(value.filter((v) => (v.id ?? v) !== student.id));
//     } else {
//       onChange([...value, student.id]);
//     }
//   };
//   // filter by search tanpa toLowerCase
//   const filteredStudents = students.filter(
//     (student) => student.name && student.name.includes(search)
//   );

//   return (
//     <div className="space-y-2">
//       <ScrollArea className="flex flex-wrap gap-1 max-h-24">
//         {students
//           .filter((student) => selectedIds.has(student.id))
//           .map((student) => (
//             <Badge key={student.id} className="flex items-center gap-1">
//               {student.name}
//               <X
//                 className="w-3 h-3 cursor-pointer"
//                 onClick={() => toggleSelect(student)}
//               />
//             </Badge>
//           ))}
//       </ScrollArea>

//       <Command>
//         <CommandInput
//           placeholder="Cari siswa..."
//           value={search}
//           onValueChange={setSearch}
//         />
//         <CommandList>
//           {filteredStudents.map((student) => (
//             <CommandItem
//               key={student.id}
//               onSelect={() => toggleSelect(student)}
//               className={selectedIds.has(student.id) ? "bg-muted" : ""}
//             >
//               {student.name}
//             </CommandItem>
//           ))}
//         </CommandList>
//       </Command>
//     </div>
//   );
// }
