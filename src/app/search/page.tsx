"use client";

import { useEffect, useState } from "react";
import { debounce } from "lodash";
import { Header } from "@/components/header";
import { ProjectCard } from "@/components/project-card";
import { TaskCard } from "@/components/task-card";
import { UserCard } from "@/components/user-card";
import { useSearchQuery } from "@/state/api";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: searchResults,
    isLoading,
    isError,
  } = useSearchQuery(searchTerm, {
    skip: searchTerm.length < 3,
  });

  const handleSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, 500);

  useEffect(() => {
    return handleSearch.cancel;
  }, [handleSearch.cancel]);

  return (
    <div className="p-8">
      <Header name="Search" />

      <div>
        <input
          type="text"
          placeholder="Search..."
          onChange={handleSearch}
          className="w-1/2 rounded border p-3 shadow"
        />
      </div>

      <div className="p-5">
        {isLoading && <p>Loading...</p>}

        {isError && <p>Error fetching search results</p>}

        {!isError && !isLoading && searchResults && (
          <div>
            {searchResults.tasks && searchResults.tasks.length > 0 && (
              <h2>Tasks</h2>
            )}

            {searchResults.tasks?.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}

            {searchResults.projects && searchResults.projects.length > 0 && (
              <h2>Projects</h2>
            )}

            {searchResults.projects?.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}

            {searchResults.users && searchResults.users.length > 0 && (
              <h2>Users</h2>
            )}

            {searchResults.users?.map((user) => (
              <UserCard key={user.userId} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}