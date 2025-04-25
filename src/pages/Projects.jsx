import React from "react";
import { FaLongArrowAltRight } from "react-icons/fa";

const Projects = () => {
  return (
    <div className="min-h-screen flex items-center justify-center mt-20 flex-col p-4">
      {/* Heading */}
      <div className="max-w-5xl w-full">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-400 bg-clip-text text-transparent mb-8">
          Featured Projects
        </h2>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        {/* Project Card */}
        <div className="flex flex-col gap-3  p-6 rounded-md hover:animate-vibrate">
          <p className="text-2xl font-semibold text-white">
            YouTube + Twitter (Backend)
          </p>
          <p className="text-md text-gray-400 leading-relaxed">
            A scalable backend project combining core features of YouTube and
            Twitter. Includes authentication, video uploads, playlist creation,
            channel subscriptions, and comment functionality — built using
            modern backend architecture.
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mt-2">
            {["Node.js", "Express", "Mongoose"].map((tech, key) => (
              <span
                className="bg-blue-800 text-blue-300 px-3 py-1  text-sm font-medium"
                key={key}
              >
                {tech}
              </span>
            ))}
          </div>

          {/* View Project Link */}
          <a
            href="https://github.com/suryapeddireddy/backend-assignments" // <-- Replace with your actual project link
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-400 cursor-pointer mt-4 hover:underline"
          >
            View Project <FaLongArrowAltRight className="text-md" />
          </a>
        </div>
        <div className="flex flex-col gap-3 p-6 rounded-md hover:animate-vibrate">
          <p className="text-2xl font-semibold text-white">
            Task Management App (Backend)
          </p>
          <p className="text-md text-gray-400 leading-relaxed">
            A backend system for organizing and tracking tasks with automated
            scheduling using NodeCron. Features include user management, task
            creation, due-date handling, and periodic updates — built with
            scalable backend technologies.
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mt-2">
            {["Node.js", "Express", "MongoDB"].map((tech, key) => (
              <span
                className="bg-blue-800 text-blue-300 px-3 py-1 text-sm font-medium"
                key={key}
              >
                {tech}
              </span>
            ))}
          </div>

          {/* View Project Link */}
          <a
            href="https://github.com/suryapeddireddy/Backend-Projects/tree/main/taskmanagement/backend"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-400 cursor-pointer mt-4 hover:underline"
          >
            View Project <FaLongArrowAltRight className="text-md" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Projects;
